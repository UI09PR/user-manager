<template>
  <div class="flex flex-col gap-4">
    <label class="text-lg font-semibold">
      Имя:
      <input v-model="userModel.name" type="text" class="w-full border-2 rounded-lg p-2 mt-1 text-[#000]" />
    </label>
    <label class="text-lg font-semibold">
      Email:
      <input v-model="userModel.email" type="email" class="w-full border-2 rounded-lg p-2 mt-1 text-[#000]" />
    </label>
    <label class="text-lg font-semibold">
      Телефон:
      <input v-model="userModel.phone" type="text" class="w-full border-2 rounded-lg p-2 mt-1 text-[#000]" />
    </label>

    <label class="text-lg font-semibold" v-if="!user">
      Аватар:
      <input v-model="userModel.avatar" type="text" class="w-full border-2 rounded-lg p-2 mt-1 text-[#000]" />
    </label>

    <p><strong>Создан: </strong>{{ getFormattedDate(new Date(userModel.createdAt)) }}</p>
    <p><strong>Изменен: </strong>{{ getFormattedDate(new Date(userModel.updatedAt)) }}</p>
    <div class="flex gap-5 mt-4">
      <component
        :is="AsyncButton"
        @click="
          () => {
            handleSubmit(userModel);
            if (closeModal) {
              toastStore.addToast('Пользователь создан', 'success', 2000);
              closeModal();
            }
          }
        "
        variant="active"
        class="text-white px-6 py-2 rounded-lg"
      >
        {{ user ? "Сохранить" : "Создать" }}
      </component>

      <router-link to="/users" class="text-white rounded-lg" v-if="user">
        <component :is="AsyncButton" variant="secondary" class="w-full px-6 py-2"> Отмена </component>
      </router-link>
      <div v-if="!user">
        <component
          :is="AsyncButton"
          variant="secondary"
          class="w-full px-6 py-2"
          @click="
            () => {
              toastStore.addToast('Отмена', 'info', 2000);
              if (closeModal) closeModal();
            }
          "
        >
          Отмена
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserT } from "@/types/user";
import { onMounted, ref } from "vue";
import { useToastsStore } from "@/stores/toasts";
import { getFormattedDate } from "@/utils/get-formatted-day";
import { useKeyboardStore } from "@/stores/keyboard";
import { defineAsyncComponent } from "vue";

const AsyncButton = defineAsyncComponent(() => import("@/components/ui/Button.vue"));

const toastStore = useToastsStore();

const { user, handleSubmit } = defineProps<{
  user?: UserT;
  handleSubmit: (data: UserT) => void;
  closeModal?: () => void;
}>();
const keyboardStore = useKeyboardStore();
const userModel = ref<UserT>({
  id: "",
  name: "",
  email: "",
  phone: "",
  avatar: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

onMounted(() => {
  keyboardStore.setFunction(() => handleSubmit(userModel.value));
  if (user) userModel.value = user;
});
</script>
