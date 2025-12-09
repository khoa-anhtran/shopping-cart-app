import { RootState } from "@/store";

export const selectCommentsStatus = (state: RootState) => state.comments.status;

export const selectCommentsError = (state: RootState) => state.comments.error;

export const selectProvinces = (state: RootState) => state.payment.provinces;

export const selectCommunes = (state: RootState) => state.payment.communes;

export const selectShippingAddress = (state: RootState) => state.payment.shippingAddress;

export const selectPaymentInfo = (state: RootState) => state.payment.paymentInfo;

export const selectPaymentStatus = (state: RootState) => state.payment.paymentStatus;

export const selectCurrentStep = (state: RootState) => state.payment.currentStep