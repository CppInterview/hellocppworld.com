import { defineUserConfig } from 'vuepress'
const { defaultTheme } = require('@vuepress/theme-default')
const vssuePlugin = require('@vssue/vuepress-plugin-vssue')
const { backToTopPlugin } = require('@vuepress/plugin-back-to-top')


export default defineUserConfig({
    lang: 'zh-CN',
    title: 'C++从入门到放弃',
    description: '《C++ 从入门到放弃》系列知识分享。',
    theme: defaultTheme({
        logo: '/images/logo.png',
        navbar: [
            {
                text: 'C++ Primer 系列',
                link: '/cpp_primer/',
            },
            {
                text: 'Efficient C++ 系列',
                link: '/efficient_cpp/',
            },
            {
                text: 'C++ 开发笔记',
                link: '/cpp_dev_notes/',
            },
            {
                text: 'C++ 面试宝典',
                link: '/cpp_interview/',
            },
            {
                text: '关于 C++',
                link: '/about_cpp/',
            },
            {
                text: 'GitHub',
                link: 'https://github.com/HelloCppWorld/',
            },
        ],
    }),
})