import { UserT } from "@/types/user";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    users: [] as UserT[],
    total: 10,
    page: 1,
    limit: 10,
    search: "" as string,
    order: "ASC" as "ASC" | "DESC",
    sort: "createdAt" as "createdAt" | "updatedAt",
    loading: true,
    error: null as string | null,
    timer: null as null | NodeJS.Timeout,
    firstLoad: true,
  }),

  actions: {
    async fetchUsers() {
      if (this.timer) clearTimeout(this.timer);
      this.loading = true;
      this.error = null;
      this.timer = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/users?limit=${this.limit}&page=${this.page}&search=${this.search}&sort=${this.sort}&order=${this.order}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }
          const jsonRes = await response.json();
          this.users = jsonRes.data;
          this.total = jsonRes.total;
        } catch (err) {
          this.error = err instanceof Error ? err.message : "Unknown error";
          console.error(this.error);
        } finally {
          this.loading = false;
          this.firstLoad = false;
        }
      }, 500);
    },

    async addUser(user: { name: string }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (!response.ok) {
          throw new Error("Failed to add user");
        }
        const newUser = await response.json();
        this.users.push(newUser);
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: string, updatedUser: { name: string }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        const updatedData = await response.json();
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) {
          this.users[index] = updatedData;
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        this.users = this.users.filter((user) => user.id !== id);
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },

    async deleteAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/all/users`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete users");
        }
        this.users = [];
      } catch (err) {
        this.error = err instanceof Error ? err.message : "Unknown error";
      } finally {
        this.loading = false;
      }
    },
  },
});
