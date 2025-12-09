import React, { useEffect, useState } from "react";
import api from "../api";

export default function TransportPage() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [busesLoading, setBusesLoading] = useState(false);
  const [routesLoading, setRoutesLoading] = useState(false);

  const [busesError, setBusesError] = useState("");
  const [routesError, setRoutesError] = useState("");

  const [routeId, setRouteId] = useState("");
  const [routeStudents, setRouteStudents] = useState([]);
  const [routeStudentsLoading, setRouteStudentsLoading] = useState(false);
  const [routeStudentsError, setRouteStudentsError] = useState("");

  const fetchBuses = async () => {
    setBusesLoading(true);
    setBusesError("");
    try {
      const res = await api.get("/transport/buses");
      setBuses(res.data || []);
    } catch (err) {
      setBusesError(
        err.response?.data?.message || "Failed to load buses from server."
      );
    } finally {
      setBusesLoading(false);
    }
  };

  const fetchRoutes = async () => {
    setRoutesLoading(true);
    setRoutesError("");
    try {
      const res = await api.get("/transport/routes");
      setRoutes(res.data || []);
    } catch (err) {
      setRoutesError(
        err.response?.data?.message || "Failed to load routes from server."
      );
    } finally {
      setRoutesLoading(false);
    }
  };

  const fetchStudentsForRoute = async (e) => {
    if (e) e.preventDefault();
    if (!routeId) {
      setRouteStudents([]);
      setRouteStudentsError("");
      return;
    }
    setRouteStudentsLoading(true);
    setRouteStudentsError("");
    try {
      const res = await api.get(`/transport/routes/${routeId}/students`);
      setRouteStudents(res.data || []);
    } catch (err) {
      setRouteStudentsError(
        err.response?.data?.message ||
          "Failed to load students for the specified route."
      );
    } finally {
      setRouteStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
    fetchRoutes();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Transport</h2>
      <p className="text-sm text-slate-600">
        View school buses, routes, and students assigned to transport routes.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Buses</p>
            {busesLoading && (
              <p className="text-xs text-slate-500">Loading buses...</p>
            )}
          </div>

          {busesError && (
            <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
              {busesError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Bus Number
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Capacity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Driver Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Driver Phone
                  </th>
                </tr>
              </thead>
              <tbody>
                {buses.length === 0 && !busesLoading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No buses found.
                    </td>
                  </tr>
                )}
                {buses.map((b) => (
                  <tr key={b.busId || b.id} className="border-b border-slate-100">
                    <td className="px-4 py-2">{b.busNumber}</td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {b.capacity != null ? b.capacity : "-"}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {b.driverName || "-"}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {b.driverPhone || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Routes</p>
            {routesLoading && (
              <p className="text-xs text-slate-500">Loading routes...</p>
            )}
          </div>

          {routesError && (
            <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
              {routesError}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Route ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    Start Point
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                    End Point
                  </th>
                </tr>
              </thead>
              <tbody>
                {routes.length === 0 && !routesLoading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      No routes found.
                    </td>
                  </tr>
                )}
                {routes.map((r) => (
                  <tr key={r.routeId || r.id} className="border-b border-slate-100">
                    <td className="px-4 py-2">{r.routeId || r.id}</td>
                    <td className="px-4 py-2 text-xs text-slate-600">{r.name}</td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {r.startPoint || "-"}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-600">
                      {r.endPoint || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Students Assigned to Route
            </p>
            <p className="text-xs text-slate-500">
              Enter a route ID to view all students assigned to that transport route.
            </p>
          </div>

          <form
            onSubmit={fetchStudentsForRoute}
            className="flex flex-wrap items-end gap-2"
          >
            <div className="w-40">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Route ID
              </label>
              <input
                type="text"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="routeId"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Lookup
            </button>
          </form>
        </div>

        {routeStudentsLoading && (
          <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-200">
            Loading students...
          </div>
        )}

        {routeStudentsError && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-200">
            {routeStudentsError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Student ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Pickup Stop
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">
                  Drop Stop
                </th>
              </tr>
            </thead>
            <tbody>
              {routeStudents.length === 0 && !routeStudentsLoading && routeId && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No students found for this route.
                  </td>
                </tr>
              )}
              {routeStudents.map((s) => (
                <tr key={s.studentId} className="border-b border-slate-100">
                  <td className="px-4 py-2">{s.studentId}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {s.pickupStop || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-600">
                    {s.dropStop || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
