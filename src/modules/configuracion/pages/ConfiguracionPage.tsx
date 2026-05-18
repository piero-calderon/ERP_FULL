import { useEffect } from 'react';
import {
  Boxes, Building2, FileText, KeyRound, ListTree, Palette, Plug, Settings2, Shield, SlidersHorizontal,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useConfiguracionStore } from '../store/configuracion.store';
import { EmpresaTab }         from '../components/EmpresaTab';
import { AlmacenesTab }       from '../components/AlmacenesTab';
import { FiscalTab }          from '../components/FiscalTab';
import { CatalogosTab }       from '../components/CatalogosTab';
import { PreferenciasTab }    from '../components/PreferenciasTab';
import { RolesTab }           from '../components/RolesTab';
import { IntegracionesTab }   from '../components/IntegracionesTab';
import { BrandingPortalTab }  from '../components/BrandingPortalTab';
import type { TabConfiguracion } from '../types/configuracion.types';

const TABS: { key: TabConfiguracion; label: string; icon: ComponentType<{ className?: string }>; descripcion: string }[] = [
  { key: 'empresa',         label: 'Empresa',              icon: Building2,        descripcion: 'Datos fiscales, branding y sucursales' },
  { key: 'almacenes',       label: 'Almacenes y zonas',    icon: Boxes,            descripcion: 'Almacenes, zonas, ubicaciones y rutas' },
  { key: 'fiscal',          label: 'Fiscal',               icon: FileText,         descripcion: 'IVA, regimenes, series y ejercicios' },
  { key: 'catalogos',       label: 'Catalogos auxiliares', icon: ListTree,         descripcion: 'Motivos, canales, segmentos y etiquetas' },
  { key: 'preferencias',    label: 'Preferencias',         icon: SlidersHorizontal,descripcion: 'Idioma, formato y notificaciones' },
  { key: 'roles',           label: 'Roles y permisos',     icon: KeyRound,         descripcion: 'Acceso rapido al modulo de auditoria' },
  { key: 'integraciones',   label: 'Integraciones',        icon: Plug,             descripcion: 'Monitor visual de conectores externos' },
  { key: 'branding_portal', label: 'Branding portal',      icon: Palette,          descripcion: 'Personalizacion del portal del cliente' },
];

function PageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-slate-100" />)}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-slate-100" />)}
      </div>
    </div>
  );
}

export default function ConfiguracionPage() {
  const store = useConfiguracionStore();

  useEffect(() => { store.cargar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const renderContent = () => {
    if (store.loading) return <PageSkeleton />;

    switch (store.tabActiva) {
      case 'empresa':
        if (!store.empresa) return <PageSkeleton />;
        return (
          <EmpresaTab
            empresa={store.empresa}
            saving={store.saving}
            onGuardar={store.guardarEmpresa}
            onGuardarSucursal={store.guardarSucursal}
            onEliminarSucursal={store.eliminarSucursal}
          />
        );
      case 'almacenes':
        return (
          <AlmacenesTab
            almacenes={store.almacenes}
            zonas={store.zonas}
            ubicaciones={store.ubicaciones}
            rutas={store.rutas}
            saving={store.saving}
            onGuardarAlmacen={store.guardarAlmacen}
            onEliminarAlmacen={store.eliminarAlmacen}
            onGuardarZona={store.guardarZona}
            onEliminarZona={store.eliminarZona}
            onGuardarRuta={store.guardarRuta}
            onEliminarRuta={store.eliminarRuta}
          />
        );
      case 'fiscal':
        if (!store.fiscal) return <PageSkeleton />;
        return (
          <FiscalTab
            fiscal={store.fiscal}
            saving={store.saving}
            onGuardarTasa={store.guardarTasa}
            onEliminarTasa={store.eliminarTasa}
            onGuardarRegimen={store.guardarRegimen}
            onEliminarRegimen={store.eliminarRegimen}
            onGuardarSerie={store.guardarSerie}
            onEliminarSerie={store.eliminarSerie}
            onSetEjercicioActivo={store.setEjercicioActivo}
          />
        );
      case 'catalogos':
        return (
          <CatalogosTab
            catalogos={store.catalogos}
            saving={store.saving}
            onGuardar={store.guardarCatalogo}
            onEliminar={store.eliminarCatalogo}
          />
        );
      case 'preferencias':
        if (!store.preferencias) return <PageSkeleton />;
        return (
          <PreferenciasTab
            preferencias={store.preferencias}
            saving={store.saving}
            onGuardar={store.guardarPreferencias}
          />
        );
      case 'roles':
        return <RolesTab roles={store.roles} permisos={store.permisos} />;
      case 'integraciones':
        return (
          <IntegracionesTab
            integraciones={store.integraciones}
            onSincronizar={store.sincronizarIntegracion}
          />
        );
      case 'branding_portal':
        if (!store.brandingPortal) return <PageSkeleton />;
        return (
          <BrandingPortalTab
            branding={store.brandingPortal}
            saving={store.saving}
            onGuardar={store.guardarBrandingPortal}
          />
        );
    }
  };

  const tabActual = TABS.find(t => t.key === store.tabActiva);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-900 p-2.5 text-white shadow-sm">
            <Settings2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Configuracion del tenant</h1>
            <p className="mt-1 text-sm text-slate-500">
              Parametrizacion global del ERP - {tabActual?.descripcion ?? 'Selecciona una seccion'}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
          <Shield className="h-4 w-4 text-emerald-500" />
          Cambios auditados - {store.auditLog.length} eventos registrados
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => store.setTab(key)}
            className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              store.tabActiva === key ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      {store.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{store.error}</div>
      )}

      {renderContent()}
    </div>
  );
}
