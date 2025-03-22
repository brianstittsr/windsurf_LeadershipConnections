import { Text } from "../Text";
import { Heading } from "../Heading";
import React from "react";

interface Props {
  className?: string;
  analyticsTitle?: React.ReactNode;
  realtimeAnalyticsText?: React.ReactNode;
  userAnalyticsText?: React.ReactNode;
  funnelOptimizationText?: React.ReactNode;
}

export default function AnalyticsDashboard({
  analyticsTitle = "Analytics",
  realtimeAnalyticsText = "Realtime analytics",
  userAnalyticsText = "User analytics",
  funnelOptimizationText = "Funnel optimization",
  ...props
}: Props) {
  return (
    <div {...props} className={`${props.className} flex flex-col items-start self-stretch flex-1`}>
      <Heading size="heading3xl" as="h5" className="ml-16 text-[20px] font-semibold !text-deep_purple-a400 md:ml-0">
        {analyticsTitle}
      </Heading>
      <div className="mt-[30px] flex self-stretch bg-white-a700 py-[30px] pl-16 pr-14 md:px-5 sm:p-5">
        <Text size="text3xl" as="p" className="text-[20px] font-normal">
          {realtimeAnalyticsText}
        </Text>
      </div>
      <div className="flex self-stretch bg-gray-50_01 py-8 pl-16 pr-14 md:px-5 sm:p-5">
        <Text size="text3xl" as="p" className="text-[20px] font-normal">
          {userAnalyticsText}
        </Text>
      </div>
      <div className="flex self-stretch bg-white-a700 py-[30px] pl-[68px] pr-14 md:px-5 sm:p-5">
        <Text size="text3xl" as="p" className="text-[20px] font-normal">
          {funnelOptimizationText}
        </Text>
      </div>
    </div>
  );
}
