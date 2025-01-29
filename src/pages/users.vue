<template>
  <div class="w-full min-h-screen flex-start flex-col mb-14">
    <div class="mt-8 px-8 flex flex-col flex-start gap-4 w-full">
      <component
        :is="AsyncPagePagination"
        :props-paths="[
          { to: '/', current: 'Главная страница' },
          { to: '/users', current: 'Пользователи' },
        ]"
      />

      <div class="flex justify-between items-start md:items-center gap-2 w-full flex-col md:flex-row">
        <label class="text-lg font-semibold flex justify-between items-center gap-2 w-[100%] md:w-[25%]">
          Лимит:
          <input
            :value="userStore.limit"
            @focus="keyboardStore.focusTarget = true"
            @blur="keyboardStore.focusTarget = false"
            @change="(e) => {
              const target = e?.target as HTMLInputElement;
              handleChangeLimit(Number(target?.value) ?? 10)
              target.blur();
              }"
            type="nubmer"
            class="w-[30%] h-16 rounded-lg p-2 text-[#000] text-center"
          />
          <component
            :is="AsyncButton"
            :icon="showFilters ? 'filter-circle-xmark' : 'filter'"
            class="ml-1"
            @click="
              () => {
                showFilters = !showFilters;
                userStore.search = '';
              }
            "
            :variant="showFilters ? 'danger' : 'dark-secondary'"
            :loading="userStore.firstLoad"
          >
            Фильтры
          </component>
        </label>
        <div class="flex-center gap-3">
          <p class="text-xs md:text-base font-semibold">Управление:</p>
          <component
            :is="AsyncButton"
            variant="active"
            @click="() => handleReduceAction('create')"
            icon="plus"
            :loading="userStore.firstLoad"
          >
            Создать
          </component>
          <component
            :is="AsyncButton"
            variant="danger"
            @click="() => handleReduceAction('deleteAll')"
            icon="trash"
            :loading="userStore.firstLoad"
          >
            Удалить все
          </component>
        </div>
      </div>
      <div v-if="showFilters" class="w-full">
        <component
          :is="AsyncSearchFilters"
          :debounce-time="500"
          :sort="userStore.sort"
          :order="userStore.order"
          @searchChange="(search) => handleFilters({ search })"
          @orderChange="(order) => handleFilters({ order })"
          @sortChange="(sort) => handleFilters({ sort })"
        />
      </div>
      <component :is="AsyncUserTable" :users="users" :delete-user="(id) => handleReduceAction('delete', id)" />
    </div>
    <div class="w-full flex-center mb-5">
      <component
        :is="AsyncPaginationUsers"
        :total-pages="Math.ceil(userStore.total / userStore.limit)"
        :current-page="userStore.page"
        @pageChange="handlePageChange"
      />
    </div>
  </div>

  <component
    :is="AsyncQuestModal"
    v-if="showModalFlag"
    :is-visible="showModalFlag"
    :title="modalTitle"
    @close="showModalFlag = false"
  >
    <template #body>
      <p class="text-[#000]">{{ modalText }}</p>
      <div v-if="modalCreate" class="mt-4">
        <component
          :is="AsyncUserForm"
          :handle-submit="userStore.addUser"
          :close-modal="() => (showModalFlag = false)"
        />
      </div>
    </template>
    <template #footer v-if="!modalCreate">
      <component
        :is="AsyncButton"
        @click="
          () => {
            modalAction(null);
            showModalFlag = false;
          }
        "
        variant="active"
        >Да</component
      >
      <component
        :is="AsyncButton"
        @click="
          () => {
            showModalFlag = false;
          }
        "
        variant="danger"
        >Нет</component
      >
    </template>
  </component>
</template>

<script setup lang="ts">
import { useToastsStore } from "@/stores/toasts";
import { useUserStore } from "@/stores/users";
import { useKeyboardStore } from "@/stores/keyboard";

import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { UserT } from "@/types/user";

const AsyncButton = defineAsyncComponent(() => import("@/components/ui/Button.vue"));
const AsyncQuestModal = defineAsyncComponent(() => import("@/components/ui/QuestModal.vue"));
const AsyncPagePagination = defineAsyncComponent(() => import("@/components/PagePagination.vue"));
const AsyncPaginationUsers = defineAsyncComponent(() => import("@/components/PaginationUsers.vue"));
const AsyncUserTable = defineAsyncComponent(() => import("@/components/UserTable.vue"));
const AsyncUserForm = defineAsyncComponent(() => import("@/components/ui/UserForm.vue"));
const AsyncSearchFilters = defineAsyncComponent(() => import("@/components/ui/SearchFilters.vue"));

const userStore = useUserStore();
const toastsStore = useToastsStore();
const keyboardStore = useKeyboardStore();

const router = useRouter();
const users = computed(() => userStore.users);

const showFilters = ref(false);

const modalTitle = ref("");
const modalCreate = ref(false);
const modalText = ref("");
const showModalFlag = ref(false);
const modalAction = ref<(user: UserT | null) => void>(() => {});

const loadUsers = async () => {
  await userStore.fetchUsers().then(() => {
    if (userStore.firstLoad || !userStore.error)
      toastsStore.addToast("Пользователи успешно загружены", "success", 3000);
  });
};

const handleFilters = async ({
  search,
  order,
  sort,
}: {
  search?: string;
  order?: "ASC" | "DESC";
  sort?: "createdAt" | "updatedAt";
}) => {
  if (search) userStore.search = search;
  if (sort) userStore.sort = sort;
  if (order) userStore.order = order;
  await userStore.fetchUsers();
};

const openModal = (title: string, text: string, action: (user: UserT | null) => void, isCreate = false) => {
  modalTitle.value = title;
  modalText.value = text;
  modalCreate.value = isCreate;
  modalAction.value = action;
  showModalFlag.value = true;
};

const handleReduceAction = (type: "create" | "delete" | "deleteAll", id?: string) => {
  if (type === "create") {
    openModal(
      "Создание",
      "Заполните все данные о пользователе",
      (user: UserT | null) => user && void userStore.addUser(user),
      true
    );
  }
  if (type === "delete" && id) {
    openModal("Удаление записи", "Вы уверены что хотите удалить запись?", () => userStore.deleteUser(id));
  }
  if (type === "deleteAll") {
    openModal(
      "Удаление всех записей",
      "Вы уверены что хотите удалить все записи? При следующем запросе будут загружены моковые данные",
      userStore.deleteAllUsers
    );
  }
};

const handlePageChange = async (page: number) => {
  userStore.page = page;
  await userStore.fetchUsers();
};

const handleChangeLimit = async (limit: number) => {
  if (limit > 999) toastsStore.addToast("max 999", "error", 3000);
  userStore.limit = Math.min(Math.max(1, limit), 999);
  await userStore.fetchUsers();
};

onMounted(() => {
  keyboardStore.setCurrent("users");
  keyboardStore.currentIndexX = 1;
  keyboardStore.currentIndexXMax = 4;
  keyboardStore.currentIndexY = 1;
  keyboardStore.currentIndexYMax = userStore.limit;

  keyboardStore.setFunctionEsc(() => router.push("/"));
  loadUsers();
});
</script>
