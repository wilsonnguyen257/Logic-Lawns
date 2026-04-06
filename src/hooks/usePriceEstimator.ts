import { useState, useEffect } from "react";

export type BlockSize = "small" | "medium" | "large";
export type ServiceType = "quickTrim" | "fullResidential" | "cleanUp";

const pricingConfig: Record<BlockSize, Record<ServiceType, number>> = {
  small: {
    quickTrim: 45,
    fullResidential: 65,
    cleanUp: 120,
  },
  medium: {
    quickTrim: 60,
    fullResidential: 85,
    cleanUp: 160,
  },
  large: {
    quickTrim: 80,
    fullResidential: 110,
    cleanUp: 220,
  },
};

export function usePriceEstimator() {
  const [blockSize, setBlockSize] = useState<BlockSize>("medium");
  const [serviceType, setServiceType] = useState<ServiceType>("fullResidential");
  const [estimatedPrice, setEstimatedPrice] = useState<number>(
    pricingConfig.medium.fullResidential
  );

  useEffect(() => {
    setEstimatedPrice(pricingConfig[blockSize][serviceType]);
  }, [blockSize, serviceType]);

  return {
    blockSize,
    setBlockSize,
    serviceType,
    setServiceType,
    estimatedPrice,
  };
}