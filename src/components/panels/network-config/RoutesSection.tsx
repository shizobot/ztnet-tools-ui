import { RouteRow } from '../../ui';

type Route = { target: string; via?: string };

type RouteEditor = {
  appendItem: (value: Route) => void;
  removeItem: (index: number) => void;
  replaceItem: (index: number, value: Route) => void;
};

type RoutesSectionProps = {
  routes: Route[];
  v6routes: Route[];
  routesEditor: RouteEditor;
  v6RoutesEditor: RouteEditor;
};

function RouteRows({
  routes,
  addLabel,
  editor,
}: {
  routes: Route[];
  addLabel: string;
  editor: RouteEditor;
}) {
  return (
    <>
      {routes.map((route, index) => (
        <RouteRow
          key={`${route.target}-${index}`}
          value={{ target: route.target, via: route.via || '' }}
          onChange={(next) =>
            editor.replaceItem(index, {
              target: next.target,
              ...(next.via ? { via: next.via } : {}),
            })
          }
          onRemove={() => editor.removeItem(index)}
        />
      ))}
      <button type="button" className="btn" onClick={() => editor.appendItem({ target: '' })}>
        {addLabel}
      </button>
    </>
  );
}

export function RoutesSection({
  routes,
  v6routes,
  routesEditor,
  v6RoutesEditor,
}: RoutesSectionProps) {
  return (
    <>
      <RouteRows routes={routes} addLabel="Add Route" editor={routesEditor} />
      <RouteRows routes={v6routes} addLabel="Add IPv6 Route" editor={v6RoutesEditor} />
    </>
  );
}
