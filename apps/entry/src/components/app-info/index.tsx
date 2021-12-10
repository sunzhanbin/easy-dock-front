import "@components/app-info/index.style";

export const SingleNavAppInfo = () => {
  return <div className="single-nav-app-info">这里是单导航时UI</div>;
};

export const MultiNavAppInfo = () => {
  return <div className="multi-nav-app-info">这里是双导航时UI</div>;
};

const AppInfo = ({ navMode }: { navMode: string }) => {
  return (
    <div className="app-info">
      {navMode === "single" && <SingleNavAppInfo />}
      {navMode === "multi" && <MultiNavAppInfo />}
    </div>
  );
};

export default AppInfo;
