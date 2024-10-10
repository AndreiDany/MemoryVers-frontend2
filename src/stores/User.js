import { defineStore } from "pinia";

export const useUser = defineStore("user", {
  state: () => {
    return {
      token: localStorage.getItem("userToken") || "",
      id: 0,
      name: localStorage.getItem("userName") || "",
      email: "",
    };
  },
  actions: {
    setName(name) {
      //setting the user name
      this.name = String(name);

      localStorage.setItem("userName", this.name.toString());
    },
    setToken(token) {
      //setting user token
      this.token = String(token);

      localStorage.setItem("userToken", this.token.toString());
    },
  },
});
