<template>
  <div class="w-full min-h-screen flex-start flex-col mb-14">
    <div class="mt-8 px-8 flex flex-col flex-start gap-4 w-full">
      <component
      :is="AsyncPagePagination"
        :props-paths="[
          { to: '/', current: 'Главная страница' },
          { to: '/users', current: 'Пользователи' },
          { to: '/users', current: 'Редактировать' },
        ]"
      />
      <div class="w-full p-4 border-2 rounded-lg flex-col flex-start gap-5">
        <div class="flex justify-between items-start flex-col gap-2 md:flex-row w-full px-4">
          <div class="w-full rounded-lg flex-col flex-start gap-5">
            <h1 class="text-3xl font-bold">Детали пользователя</h1>
            <component :is="AsyncUserForm" :user="user" :handle-submit="saveUser" />
          </div>
          <img :src="user?.avatar" alt="avatar" />
        </div>
      </div>
      <div class="w-full flex-center">
        <component
          :is="AsyncButton"
          variant="danger"
          class="w-[40%]"
          @click="
            () => {
              if (user) handleDeleteUser(user.id);
            }
          "
        >
          Удалить
        </component>
      </div>
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
    </template>
    <template #footer>
      <component
        :is="AsyncButton"
        @click="
          () => {
            modalAction();
            showModalFlag = false;
          }
        "
        variant="active"
        >Да</component
      >
      <component :is="AsyncButton" @click="showModalFlag = false" variant="danger">Нет</component>
    </template>
  </component>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted, defineAsyncComponent } from "vue";
import { useUserStore } from "@/stores/users";
import { useToastsStore } from "@/stores/toasts";
import { UserT } from "@/types/user";
import { useKeyboardStore } from "@/stores/keyboard";

const AsyncButton = defineAsyncComponent(() => import("@/components/ui/Button.vue"));
const AsyncQuestModal = defineAsyncComponent(() => import("@/components/ui/QuestModal.vue"));
const AsyncPagePagination = defineAsyncComponent(() => import("@/components/PagePagination.vue"));
const AsyncUserForm = defineAsyncComponent(() => import("@/components/ui/UserForm.vue"));

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const toastsStore = useToastsStore();

const keyboardStore = useKeyboardStore();

const modalTitle = ref("");
const modalText = ref("");
const showModalFlag = ref(false);
const modalAction = ref(() => {});

const handleDeleteUser = (id: string) => {
  modalText.value = "Вы уверены что хотите удалить запись?";
  modalTitle.value = "Удаление записи";
  modalAction.value = () => {
    userStore.deleteUser(id);
    router.push("/users");
  };
  showModalFlag.value = true;
};

const userId = route.params.id;
const user = computed(() => userStore.users.find((u) => u.id === userId));

const saveUser = async (editableUser: UserT) => {
  try {
    if (!user.value) throw "not found";
    await userStore.updateUser(user.value.id, editableUser);
    toastsStore.addToast("Пользователь успешно обновлён", "success", 3000);
    router.push("/users");
  } catch {
    toastsStore.addToast("Ошибка сохранения изменений", "error", 3000);
  }
};

onMounted(() => {
  keyboardStore.setCurrent("edit");
  keyboardStore.setFunctionEsc(() => router.push("/users"));

  if (!user.value) {
    toastsStore.addToast("Пользователь не найден", "error", 3000);
    router.push("/users");
  }
});
</script>
