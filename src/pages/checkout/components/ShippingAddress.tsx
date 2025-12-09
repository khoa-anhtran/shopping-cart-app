import { Button, Checkbox, Select } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectCommunes, selectProvinces, selectShippingAddress } from "../selectors";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCommunesRequested, shippingAddressSubmited } from "../actions";
import type { Commune, ShippingAddressType } from "@/types/checkout";
import { shippingAddressSchema } from "@/schemas/shippingAddress.schema";

type ShippingAdressProps = {
    goPrev: () => void,
    goNext: () => void,
}

const ShippingAddress = ({ goNext, goPrev }: ShippingAdressProps) => {
    const shippingAddress = useSelector(selectShippingAddress)

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ShippingAddressType>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: shippingAddress
    });

    const onSubmit = (data: ShippingAddressType) => {
        dispatch(shippingAddressSubmited(data))
        goNext()
    };

    const dispatch = useDispatch()

    const provinces = useSelector(selectProvinces)
    const communes = useSelector(selectCommunes)

    useEffect(() => {
        console.log(watch("province"))
        console.log(provinces)

        if (watch("province") && provinces.length !== 0) {
            dispatch(fetchCommunesRequested(provinces.find(province => province.name === watch("province"))?.code ?? ""))

            const currentCommune = watch("commune") as Commune

            if (currentCommune.provinceCode !== watch("province").code)
                setValue("commune", "")
        }

    }, [dispatch, provinces, setValue, watch])

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-base lg:text-lg font-semibold">Shipping address</h3>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-xs mb-1">First name*</label>
                    <input
                        className="w-full px-3 py-1 rounded-md border border-gray-200"
                        placeholder="Khoa"
                        {...register("firstName")}
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-xs mb-1">Last name*</label>
                    <input
                        className="w-full px-3 py-1 rounded-md border border-gray-200"
                        placeholder="Tran"
                        {...register("lastName")}
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-xs mb-1">Address line 1*</label>
                <input
                    className="w-full px-3 py-1 rounded-md border border-gray-200"
                    placeholder="Street name and number"
                    {...register("addressLine")}
                />
                {errors.addressLine && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.addressLine.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs mb-1">Address line 2</label>
                <input
                    className="w-full px-3 py-1 rounded-md border border-gray-200"
                    placeholder="Apartment, suite, etc. (optional)"
                    {...register("subAddressLine")}
                />
                {errors.subAddressLine && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.subAddressLine.message}
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-xs mb-1">Province*</label>
                    <Controller
                        name="province"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                className="w-full"
                                value={field.value || undefined}
                                onChange={(value: string) => field.onChange(value)}
                                placeholder="Select a province"
                                options={provinces.map(province => ({ value: province.name, label: province.name }))}

                            />
                        )}
                    />
                    {errors.province && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.province.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-xs mb-1">Commune*</label>
                    <Controller
                        name="commune"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                className="w-full"
                                value={field.value || undefined}
                                onChange={(value: string) => field.onChange(value)}
                                placeholder="Select a commune"
                                disabled={watch("province") === undefined}
                                options={communes.map(commune => ({ value: commune.name, label: commune.name }))}
                            />
                        )}
                    />
                    {errors.commune && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.commune.message}
                        </p>
                    )}
                </div>
            </div>

            <Controller
                name="isSaved"
                control={control}
                render={({ field }) => (
                    <Checkbox
                        className="text-xs text-slate-300"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                    >
                        Save this address for next check out
                    </Checkbox>
                )}
            />
            {errors.isSaved && (
                <p className="mt-1 text-xs text-red-400">{errors.isSaved.message}</p>
            )}

            <div className="mt-8 flex justify-between">
                <Button
                    type="link"
                    className="text-slate-300 px-0"
                    disabled={true}
                    onClick={goPrev}
                >
                    Previous
                </Button>

                <Button type="primary" htmlType="submit">
                    Next
                </Button>
            </div>
        </form>
    );
};

export default ShippingAddress;
