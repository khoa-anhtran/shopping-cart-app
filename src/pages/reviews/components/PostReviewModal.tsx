import { Modal, Rate, Input, Checkbox, Upload, Button } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { postReviewSchema } from "@/schemas";
import { PostReviewFormType } from "@/types";

type PostReviewModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PostReviewFormType) => void;
}

const PostReviewModal = ({ open, onClose, onSubmit }: PostReviewModalProps) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<PostReviewFormType>({
        resolver: zodResolver(postReviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
            recommend: false,
            name: "",
            phone: "",
            images: [],
        },
    });

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const submit = (data: PostReviewFormType) => {
        onSubmit(data);
        reset();
        setFileList([]);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            width={600}
        >
            <div className="flex flex-col gap-6 p-2">
                <h2 className="text-center text-lg font-semibold">Review Product</h2>

                {/* Rating */}
                <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col items-center">
                            <Rate {...field} value={field.value} allowHalf size="large" />
                            {errors.rating && (
                                <span className="text-red-600 text-sm">{errors.rating.message}</span>
                            )}
                        </div>
                    )}
                />

                {/* Comment */}
                <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col">
                            <Input.TextArea
                                {...field}
                                rows={4}
                                placeholder="Please write something here..."
                            />
                        </div>
                    )}
                />

                {/* Upload */}
                <Controller
                    name="images"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={() => false}
                                onChange={({ fileList }) => {
                                    setFileList(fileList);
                                    field.onChange(fileList);
                                }}
                                maxCount={3}
                            >
                                {fileList.length < 3 && "Upload"}
                            </Upload>
                            {errors.images && (
                                <span className="text-red-600 text-sm">{errors.images.message as string}</span>
                            )}
                        </div>
                    )}
                />

                {/* Recommend */}
                <Controller
                    name="recommend"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center gap-2">
                            <Checkbox {...field} checked={field.value} id="reference-checkbox" />
                            <label htmlFor="reference-checkbox">
                                I will recommend this product to my friends and family.
                            </label>
                        </div>
                    )}
                />

                {/* Name + Phone */}
                <div className="flex gap-3">
                    <div className="flex flex-col w-1/2">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Your name*" />
                            )}
                        />
                        {errors.name && (
                            <span className="text-red-600 text-sm">{errors.name.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col w-1/2">
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Your phone number*" />
                            )}
                        />
                        {errors.phone && (
                            <span className="text-red-600 text-sm">{errors.phone.message}</span>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="primary"
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={handleSubmit(submit)}
                >
                    Send review
                </Button>
            </div>
        </Modal >
    );
}

export default PostReviewModal