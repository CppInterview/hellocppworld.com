const { defaultTheme } = require('@vuepress/theme-default')
const vssue = require('@vssue/vuepress-plugin-vssue')
module.exports = {
    lang: 'zh-CN',
    title: 'C++从入门到放弃',
    description: '《C++ 从入门到放弃》系列知识分享。',
    theme: defaultTheme({
        logo: '/images/logo.png',
        navbar: [
            {
                text: 'C++ Primer系列',
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
        ],
    }),
    plugins:[
        vssue({
            platform: 'github-v4',
            owner: 'HelloCppWorld',
            repo: 'comments',
            clientId: 'b11bd27cb39ec96b732d',
            clientSecret: '90169121f04d20054312c63617c3761792cd8d37',
        }), 
    ],
}