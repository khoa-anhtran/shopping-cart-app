import { Button, Checkbox, Input, Select } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const schema = z.object({
    firstName: z.string("First name should be string").min(1, "First name should not empty").regex(/^[\p{L}\s]+$/u, "Only letters and spaces are allowed"),
    lastName: z.string("Last name should be string").min(1, "Last name should not empty").regex(/^[\p{L}\s]+$/u, "Only letters and spaces are allowed"),
    addressLine: z.string("Address line should be string").min(1, "Address line should not empty"),
    subAddressLine: z.string().optional(),
    province: z.string().min(1, "Required"),
    commune: z.string().min(1, "Required"),
    isSaved: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type ShippingAdressProps = {
    goPrev: () => void,
    goNext: () => void,
    current: number
}

const ShippingAddress = ({ current, goNext, goPrev }: ShippingAdressProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            isSaved: false,
        },
    });

    const onSubmit = (data: FormValues) => {
        console.log(data);
    };

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
                                onChange={(value) => field.onChange(value)}
                                placeholder="Select a province"
                                options={[
                                    { value: "1", label: "Jack" },
                                    { value: "2", label: "Lucy" },
                                    { value: "3", label: "Tom" },
                                ]}
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
                                onChange={(value) => field.onChange(value)}
                                placeholder="Select a commune"
                                options={[
                                    { value: "1", label: "Jack" },
                                    { value: "2", label: "Lucy" },
                                    { value: "3", label: "Tom" },
                                ]}
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
                    disabled={current === 0}
                    onClick={goPrev}
                >
                    Previous
                </Button>

                <Button type="primary" htmlType="submit">
                    {current == 2 ? "Place order" : "Next"}
                </Button>
            </div>
        </form>
    );
};

export default ShippingAddress;
