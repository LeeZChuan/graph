export default [
    {
        name: '首页',
        path: '/',
        show: false,
        component: () => import('@/Route/index'),
    },
    {
        name: '标准化图表组件',
        path: 'standardized',
        component: () => import('@/Standardization/index'),
    },
]