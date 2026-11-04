<script lang="ts" setup>
import { useI18nContext } from '@/i18n'

const { Locale } = useI18nContext()
</script>

<template>
    <section class="p-32">
        <h1 class="mt-0">{{ Locale.app.console }}</h1>
        <p class="text-#667085">登录后的客户工作台放在 /client。菜单、权限和业务页从这里按模块扩展。</p>
    </section>
</template>