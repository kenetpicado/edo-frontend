export const authRoutes = [
  {
    path: '',
    component: () => import('../views/HomeView.vue'),
    name: 'home',
    meta: {
      title: 'Inicio',
      roles: ['ROOT', 'ADMINISTRADOR']
    }
  },
  {
    path: 'usuarios',
    component: () => import('../views/UsersView.vue'),
    name: 'users',
    meta: {
      title: 'Usuarios',
      roles: ['ROOT', 'ADMINISTRADOR']
    }
  },
  {
    path: 'lotes',
    component: () => import('../views/Batch/BatchView.vue'),
    name: 'batches',
    meta: {
      title: 'Lotes',
      roles: ['ROOT', 'ADMINISTRADOR']
    }
  },
  {
    path: 'lotes/crear',
    component: () => import('../views/Batch/BatchCreate.vue'),
    name: 'batches.create',
    meta: {
      title: 'Crear Lote',
      roles: ['ROOT', 'ADMINISTRADOR']
    }
  },
  {
    path: 'lotes/:id',
    component: () => import('../views/Batch/BatchShow.vue'),
    name: 'batches.show',
    meta: { title: 'Detalles Lote', roles: ['ROOT', 'ADMINISTRADOR'] }
  },
  {
    path: 'paquetes',
    component: () => import('../views/Package/PackageView.vue'),
    name: 'packages',
    meta: { title: 'Paquetes', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'encomiendas',
    component: () => import('../views/Shipment/ShipmentView.vue'),
    name: 'shipments',
    meta: { title: 'Encomiendas', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'encomiendas/crear',
    component: () => import('../views/Shipment/ShipmentCreate.vue'),
    name: 'shipments.create',
    meta: { title: 'Crear Encomienda', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'encomiendas/:id',
    component: () => import('../views/Shipment/ShipmentShow.vue'),
    name: 'shipments.show',
    meta: { title: 'Encomienda', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'encomiendas/:id/editar',
    component: () => import('../views/Shipment/ShipmentCreate.vue'),
    name: 'shipments.edit',
    meta: { title: 'Encomienda', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'correo',
    component: () => import('../views/MailPackage/MailPackageView.vue'),
    name: 'mail.packages',
    meta: { title: 'Paquetes de correos', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'facturacion',
    component: () => import('../views/Billing/BillingView.vue'),
    name: 'billing',
    meta: { title: 'Facturación', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'facturacion/crear',
    component: () => import('../views/Billing/BillingCreate.vue'),
    name: 'billing.create',
    meta: { title: 'Crear Factura', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'facturacion/:id',
    component: () => import('../views/Billing/BillingShow.vue'),
    name: 'billing.show',
    meta: { title: 'Factura', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'gastos',
    component: () => import('../views/Expense/ExpenseView.vue'),
    name: 'expenses',
    meta: { title: 'Gastos', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'arqueos',
    component: () => import('../views/Arching/ArchingView.vue'),
    name: 'archings',
    meta: { title: 'Arqueos', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'arqueos/crear',
    component: () => import('../views/Arching/ArchingCreate.vue'),
    name: 'archings.create',
    meta: { title: 'Crear Arqueo', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'arqueos/:id',
    component: () => import('../views/Arching/ArchingShow.vue'),
    name: 'archings.show',
    meta: { title: 'Arqueo', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  },
  {
    path: 'configuracion',
    component: () => import('../views/Setting/SettingView.vue'),
    name: 'settings',
    meta: { title: 'Configuración', roles: ['ROOT', 'ADMINISTRADOR'] }
  },
  {
    path: 'perfil',
    component: () => import('../views/Profile/ProfileView.vue'),
    name: 'profile',
    meta: { title: 'Perfil', roles: ['ROOT', 'ADMINISTRADOR', 'CAJERO'] }
  }
]

export function getFirstAuthorized(role: string) {
  return authRoutes.find((route) => route.meta?.roles?.includes(role)) || { name: 'profile' }
}
