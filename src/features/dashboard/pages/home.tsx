import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";

export const HomePage = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: "Dashboard", url: "/" }]}
    >
      <></>
    </DashboardPageLayout>
  );
};