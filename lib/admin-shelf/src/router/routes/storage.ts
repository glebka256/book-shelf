import { RouteRecordRaw } from 'vue-router'
import StorageManager from '@/views/storage-manager/StorageManager.vue'

export const storageRoutes: RouteRecordRaw[] = [
    {
        path: "/storage-manager",
        component: StorageManager,
        children: [
            { path: '', name: 'storage-manager', redirect: '/storage-manager/books' },
            { path: 'books', name: 'storage-manager-books', component: StorageManager },
            { path: 'create', name: 'storage-manager-create', component: StorageManager },
            { path: 'stats', name: 'storage-manager-stats', component: StorageManager },
            { path: 'edit/:bookId', name: 'storage-manager-edit', component: StorageManager, props: true },
            { path: 'remove/:bookId', name: 'storage-manager-remove', component: StorageManager, props: true }
        ]
    }
]