<template>
  <div class="w-full">
    <ul class="w-full flex-center flex-col gap-5">
      <li v-if="users.length < 1" class="border-2 rounded-lg flex-between flex-col md:flex-row w-full p-4">
        <h1>Тут будут пользователи</h1>
      </li>
      <li
        v-for="(user, i) in users"
        :key="user.id"
        @mouseover="keyboardStore.currentIndexY = i + 1"
        class="border-2 rounded-lg flex-between flex-col md:flex-row w-full p-4"
        ref="userItems"
      >
        <div class="flex justify-start items-center gap-6">
          <p v-if="keyboardStore.current === 'users' && keyboardStore.currentIndexY === i + 1" class="-ml-1 text-green-200">></p>
          <img :src="user.avatar" alt="avatar" class="rounded-[50%] w-14" />
          <div class="flex-start flex-col gap-1">
            <p>{{ user.name }}</p>
            <p class="text-xs"><strong>Создан: </strong>{{ getFormattedDate(new Date(user.createdAt)) }}</p>
            <p class="text-xs"><strong>Изменен: </strong>{{ getFormattedDate(new Date(user.updatedAt)) }}</p>
            <p class="text-xs"><strong>email: </strong>{{ user.email }}</p>
          </div>
        </div>
        <div class="flex-center gap-5">
          <component
            :is="AsyncButton"
            @click="
              (e) => {
                callTo(user, 'mail');
                e.target.blur();
              }
            "
            type="button"
            class="text-[#0a0a08] text-xs sm:text-xs md:text-xs xl:text-xs ml-1"
            :class="`text-[#0a0a08] text-xs sm:text-xs md:text-xs xl:text-xs ${
              keyboardStore.current === 'users' &&
              keyboardStore.currentIndexY === i + 1 &&
              keyboardStore.currentIndexX === 1
                ? 'outline outline-2 outline-red-500'
                : ''
            }`"
            icon="envelope"
            size="xs"
            variant="active"
            :noSafari="isSafari"
          >
          </component>
          <component
            :is="AsyncButton"
            type="button"
            @click="() => callTo(user, 'tel')"
            class="text-[#0a0a08] text-xs sm:text-xs md:text-xs xl:text-xs"
            :class="`text-[#0a0a08] text-xs sm:text-xs md:text-xs xl:text-xs ${
              keyboardStore.current === 'users' &&
              keyboardStore.currentIndexY === i + 1 &&
              keyboardStore.currentIndexX === 2
                ? 'outline outline-2 outline-red-500'
                : ''
            }`"
            icon="phone"
            variant="active"
            :noSafari="isSafari"
          ></component>
          <p>{{ user.phone }}</p>
          <component
            :is="AsyncButton"
            @click="() => deleteUser(user.id)"
            type="button"
            :class="`text-[#0a0a08] text-xs sm:text-xs md:text-xs xl:text-xs ${
              keyboardStore.current === 'users' &&
              keyboardStore.currentIndexY === i + 1 &&
              keyboardStore.currentIndexX === 3
                ? 'outline outline-2 outline-red-300'
                : ''
            }`"
            icon="xmark"
            size="xs"
            variant="danger"
            :noSafari="isSafari"
          >
          </component>
          <router-link :to="`/user/${user.id}`"
            ><component
              :is="AsyncButton"
              @click=""
              type="button"
              :class="`text-[#0a0a08] text-xs sm:text-xs md:text-xs xl:text-xs ${
                keyboardStore.currentIndexY === i + 1 && keyboardStore.currentIndexX === 4
                  ? 'outline outline-2 outline-red-500'
                  : ''
              }`"
              icon="edit"
              size="xs"
              variant="secondary"
              :noSafari="isSafari"
            >
            </component>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { UserT } from "@/types/user";
import { getFormattedDate } from "@/utils/get-formatted-day";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useKeyboardStore } from "@/stores/keyboard";
import { useRouter } from "vue-router";

const AsyncButton = defineAsyncComponent(() => import("@/components/ui/Button.vue"));

const { users, deleteUser } = defineProps<{ users: UserT[]; deleteUser: (id: string) => void }>();
const isSafari = ref(false);
const router = useRouter();
const keyboardStore = useKeyboardStore();

const callTo = (targetUser: UserT, type: "tel" | "mail") => {
  const To =
    type === "tel"
      ? `tel:${targetUser.phone}`
      : `mailto:${targetUser.email}?subject=${encodeURIComponent("Theme")}&body=${encodeURIComponent("hello")}`;
  window.location.href = To;
};

onMounted(() => {
  keyboardStore.currentFunction = () => {
    const targetUser = users[keyboardStore.currentIndexY - 1];
    if (keyboardStore.currentIndexX === 4) {
      router.push(`/user/${targetUser.id}`);
    }
    if (keyboardStore.currentIndexX === 3) {
      deleteUser(targetUser.id);
    }
    if (keyboardStore.currentIndexX === 2) {
      callTo(targetUser, "tel");
    }
    if (keyboardStore.currentIndexX === 1) {
      callTo(targetUser, "mail");
    }
  };
  isSafari.value = /^((?!chrome|android).)*safari/i.test(navigator?.userAgent);
});
</script>
