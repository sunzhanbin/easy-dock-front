import { useMemo } from "react";
import { useParams } from "react-router";
import { useAppSelector } from "@/store";
import { useWorkspaceDetailQuery } from "@http/app-manager.hooks";
import { selectCurrentId } from "@views/workspace/index.slice";
import { findItem } from "@utils/utils";
import "@containers/asset-pages/iframe-page.style";

const IframeMicroPage = () => {
  const { workspaceId } = useParams();
  const selectedKey = useAppSelector(selectCurrentId);
  const { menu } = useWorkspaceDetailQuery(+(workspaceId as string), {
    selectFromResult: ({ data }) => ({
      menu: data?.extension?.meta?.menuList,
    }),
  });
  const url = useMemo(() => {
    const menuInfo = findItem(selectedKey, menu);
    return menuInfo?.form?.assetConfig?.url;
  }, [selectedKey, menu]);

  return (
    <div className="iframe-page">
      <iframe className="iframe" src={url} frameBorder={0}></iframe>
    </div>
  );
};

export default IframeMicroPage;
