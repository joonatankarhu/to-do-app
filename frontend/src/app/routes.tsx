import type { RouteObject } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import { getApiUrl, getAuthHeaders } from '@src/helpers/api';
import { isAuthenticated } from '@src/store/authUser';

// Helper functions to match Framework Mode API
function index(file: string): RouteObject {
  return {
    index: true,
    lazy: async () => {
      const module = await import(/* @vite-ignore */ file);
      return { Component: module.default };
    },
  };
}

function route(path: string, file: string, loader?: RouteObject['loader']): RouteObject {
  return {
    path,
    loader,
    lazy: async () => {
      const module = await import(/* @vite-ignore */ file);
      return { Component: module.default };
    },
  };
}

function layout(file: string, children: RouteObject[]): RouteObject {
  return {
    lazy: async () => {
      const module = await import(/* @vite-ignore */ file);
      return { Component: module.default };
    },
    errorElement: <ErrorBoundary />,
    children,
  };
}

function prefix(pathPrefix: string, routes: RouteObject[]): RouteObject[] {
  return routes.map((route) => ({
    ...route,
    path: route.path ? `${pathPrefix}/${route.path}` : pathPrefix,
  }));
}

// Route configuration following Framework Mode pattern
export default [
  layout('./Layout.tsx', [
    index('./pages/home.tsx'),
    route('signin', './pages/auth/SignIn.tsx'),
    route('signup', './pages/auth/SignUp.tsx'),
    route('tasks', './pages/tasks/index.tsx'),
    route('profile', './pages/profile.tsx'),
    ...prefix('tasks', [
      route('create', './pages/tasks/create.tsx'),
      route(
        ':id/edit',
        './pages/tasks/edit.tsx',
        async ({ params, request }) => {
          if (!isAuthenticated()) {
            return redirect('/');
          }

          const apiUrl = getApiUrl();
          const response = await fetch(`${apiUrl}/api/tasks/${params.id}/`, {
            headers: getAuthHeaders(),
            signal: request.signal,
          });

          if (!response.ok) {
            if (response.status === 404) {
              throw new Response('Task not found', { status: 404 });
            }
            throw new Response('Failed to load task', { status: response.status });
          }

          return response.json();
        }
      ),
      route(
        ':id',
        './pages/tasks/show.tsx',
        async ({ params, request }) => {
          if (!isAuthenticated()) {
            return redirect('/');
          }

          const apiUrl = getApiUrl();
          const response = await fetch(`${apiUrl}/api/tasks/${params.id}/`, {
            headers: getAuthHeaders(),
            signal: request.signal,
          });

          if (!response.ok) {
            if (response.status === 404) {
              throw new Response('Task not found', { status: 404 });
            }
            throw new Response('Failed to load task', { status: response.status });
          }

          return response.json();
        }
      ),
    ]),
  ]),
] satisfies RouteObject[];
