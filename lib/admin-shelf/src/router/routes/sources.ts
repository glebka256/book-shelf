import { RouteRecordRaw } from 'vue-router'
import SourcesManager from '@/views/sources-manager/SourcesManager.vue'

export const sourcesRoutes: RouteRecordRaw[] = [
    {
        path: "/sources-manager",
        component: SourcesManager,
        children: [
            { path: '', name: 'sources-manager', redirect: '/sources-manager/home' },
            { path: 'home', name: 'sources-manager-home', component: SourcesManager },
            { path: 'goodreads', name: 'sources-manager-goodreads', component: SourcesManager },
            { path: 'open-lib', name: 'sources-manager-open-lib', component: SourcesManager },
            { path: 'gutenberg-search', name: 'sources-manager-gutenberg-search', component: SourcesManager },
            { path: 'gutenberg-detailed', name: 'sources-manager-gutenberg-detailed', component: SourcesManager },
            { path: 'annas-archive', name: 'sources-manager-annas-archive', component: SourcesManager },
            { path: 'best-all', name: 'sources-manager-best-all', component: SourcesManager },
            { path: 'best-detailed', name: 'sources-manager-best-detailed', component: SourcesManager }
        ]
    }
]