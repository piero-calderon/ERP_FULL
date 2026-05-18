import { ArrowUpRight, KeyRound, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.constants';
import type { PermisoResumen, RolResumen } from '../types/configuracion.types';
import { MiniKpi, SectionCard, StatusPill, PrimaryButton } from './ui';

interface Props {
  roles: RolResumen[];
  permisos: PermisoResumen[];
}

export function RolesTab({ roles, permisos }: Props) {
  const totalPermisos = permisos.length;
  const totalUsuarios = roles.reduce((acc, r) => acc + r.usuarios, 0);
  const rolesSistema = roles.filter(r => r.isSystem).length;

  // permisos agrupados por modulo (matriz visual)
  const modulos = Array.from(new Set(permisos.map(p => p.modulo)));

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-600" />
          <div className="flex-1">
            <p className="font-semibold">Resumen sincronizado con Auditoria y Seguridad</p>
            <p className="mt-1 text-xs">Esta vista replica los datos del modulo de Auditoria (14.3) sin duplicar logica. Para editar permisos detalle ve al modulo de auditoria.</p>
          </div>
          <Link to={ROUTES.AUDITORIA} className="hidden sm:block">
            <PrimaryButton><ArrowUpRight className="h-4 w-4" /> Ir a Auditoria</PrimaryButton>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MiniKpi label="Roles configurados" value={roles.length}    helper={`${rolesSistema} de sistema`} tone="bg-violet-50 text-violet-700" />
        <MiniKpi label="Usuarios cubiertos" value={totalUsuarios}   helper="Asociados a un rol"          tone="bg-blue-50 text-blue-700" />
        <MiniKpi label="Permisos disponibles" value={totalPermisos} helper="Acciones modeladas"          tone="bg-emerald-50 text-emerald-700" />
        <MiniKpi label="Modulos" value={modulos.length}             helper="Cobertura matriz"            tone="bg-amber-50 text-amber-700" />
      </div>

      <SectionCard title="Roles" description="Listado consolidado de roles activos en el tenant.">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {roles.map(r => (
            <article key={r.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <KeyRound className="mt-0.5 h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{r.nombre}</p>
                    <p className="text-xs text-slate-500">{r.descripcion}</p>
                  </div>
                </div>
                {r.isSystem && <StatusPill tone="bg-slate-50 text-slate-600 border-slate-200" label="Sistema" />}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-2 text-center">
                  <p className="text-slate-500">Permisos</p>
                  <p className="text-lg font-bold text-slate-900">{r.permisos}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2 text-center">
                  <p className="text-slate-500">Usuarios</p>
                  <p className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1"><Users className="h-3 w-3" />{r.usuarios}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Matriz de permisos" description="Disponibilidad por modulo y accion (read-only).">
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Modulo</th>
                <th className="px-3 py-2">Acciones</th>
                <th className="px-3 py-2">Cobertura</th>
              </tr>
            </thead>
            <tbody>
              {modulos.map(mod => {
                const acciones = permisos.filter(p => p.modulo === mod);
                return (
                  <tr key={mod} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-semibold text-slate-800">{mod}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {acciones.map(a => (
                          <span key={a.id} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{a.accion}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">{acciones.length} accion(es)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
