<script setup>
import { RouterLink } from "vue-router";
import router from "../../router";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

import { useUser } from "../../stores/User.js";
const user = useUser();

const navigation = [
  { name: "Acasă", to: "/", current: true },
  { name: "Viziune", to: "/about", current: false },
  { name: "Contact", to: "/contact", current: false },
];

function logout() {
  user.id = 0;
}

function login() {
  router.push("/login");
}
</script>

<template>
  <Disclosure as="nav" class="bg-accent" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <RouterLink to="/">
              <img
                class="h-12 w-12"
                src="/src/images/MemoryVerseLogoWhite.png"
                alt="logo"
              />
            </RouterLink>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium',
                ]"
                :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</RouterLink
              >
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Profile dropdown -->
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton
                  class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span class="absolute -inset-1.5"></span>
                  <UserCircleIcon class="h-8 w-8 rounded-full text-white" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <!-- <MenuItem v-slot="{ active }">
                    <RouterLink
                      to="/profile"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >Profil</RouterLink
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <RouterLink
                      to="/setings"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >Setari</RouterLink
                    >
                  </MenuItem> -->
                  <MenuItem v-if="user.id == 0" v-slot="{ active }">
                    <button
                      @click="login"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block w-full px-4 py-2 text-sm font-bold text-gray-700',
                      ]"
                    >
                      Conectare
                    </button>
                  </MenuItem>
                  <MenuItem v-if="user.id != 0" v-slot="{ active }">
                    <div
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block w-full px-4 pt-2 pb-1 text-sm font-medium text-gray-700',
                      ]"
                    >
                      {{ user.name }}
                    </div>
                  </MenuItem>
                  <MenuItem v-if="user.id != 0" v-slot="{ active }">
                    <div
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block w-full px-4 pt-1 pb-2 text-sm text-gray-700',
                      ]"
                    >
                      {{ user.email }}
                    </div>
                  </MenuItem>
                  <MenuItem v-if="user.id != 0" v-slot="{ active }">
                    <button
                      @click="logout"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block w-full px-4 py-2 text-sm font-bold text-gray-700',
                      ]"
                    >
                      Deconectare
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="absolute -inset-0.5"></span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="md:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          :class="[
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</RouterLink
        >
      </div>
      <div class="border-t border-gray-700 pb-3 pt-4">
        <div v-if="user.id != 0" class="flex items-center px-5">
          <div class="ml-3">
            <div class="py-1 text-base font-medium leading-none text-white">
              {{ user.name }}
            </div>
            <div class="text-sm font-medium leading-none text-gray-400">
              {{ user.email }}
            </div>
          </div>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <!-- <RouterLink
            to="/profile"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >Profil</RouterLink
          >
          <RouterLink
            to="/setings"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >Setari</RouterLink
          > -->
          <DisclosureButton
            as="button"
            v-if="user.id == 0"
            @click="login"
            class="block rounded-md px-3 pb-2 text-base font-medium text-gray-100 hover:bg-gray-700 hover:text-white"
            >Conectare</DisclosureButton
          >
          <DisclosureButton
            as="button"
            v-if="user.id != 0"
            @click="logout"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
            >Deconectare</DisclosureButton
          >
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
