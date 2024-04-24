'use client';

import ResponsiveDrawer from "./ResponsiveDrawer";

const AppPage = ({ children }: { children: React.ReactElement }) => {

  return (
    <ResponsiveDrawer >
      {children}
    </ResponsiveDrawer>
  )
}


export default  AppPage