<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { isLoggedIn, authInfo} from "@/store/auth.js"
</script>

<template>
  <div>
    <div class="navbar">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/Posts" v-if="isLoggedIn">Posts</RouterLink>

      <div class="navbar-action">
        <div v-if="!isLoggedIn">
          <RouterLink to="/register">Register</RouterLink>
        </div>
        <div v-else>
          <RouterLink to="/account"> {{ authInfo.author_name }} </RouterLink>
        </div>
      </div>
    </div>

    <hr>
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
}

</style>
