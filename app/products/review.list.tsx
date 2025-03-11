import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useGetReviewsQuery } from '@/redux/review/review.query'
import { IRateDistribution, IReview } from '@/redux/review/review.interface'
import dayjs from "@/utils/dayjs.timezone"
import { useAppDispatch } from '@/hooks/useRedux'
import { ReviewActions } from '@/redux/review/review.slice'

const RenderStars = ({ rating }: { rating: number }) => {
    return (
        <View className='flex flex-row gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color={star <= rating ? '#FFD700' : '#E0E0E0'}
                />
            ))}
        </View>
    )
}

const ReviewItem = ({ review }: { review: IReview }) => {
    return (
        <View className="py-2 my-2 px-3 border border-gray-200 rounded-lg shadow-xs">
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                {review.user?.avatar?.url ? (
                    <Image
                        source={{ uri: review.user.avatar.url }}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            marginRight: 12
                        }}
                    />
                ) : (
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#f0f0f0',
                        marginRight: 12,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: '#888' }}>👤</Text>
                    </View>
                )}
                <View className='space-y-1'>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#333'
                    }}>
                        {review.user?.name || 'Ẩn danh'}
                    </Text>
                    <RenderStars rating={review.rate} />
                </View>
            </View>

            <Text style={{
                color: '#666',
                marginBottom: 8
            }}>
                {review.comment}
            </Text>

            {review.images && review.images.length > 0 && (
                <View style={{
                    flexDirection: 'row',
                    marginTop: 8
                }}>
                    {review.images.map((img, index) => (
                        <Image
                            key={index}
                            source={{ uri: img.url }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 8,
                                marginRight: 8
                            }}
                        />
                    ))}
                </View>
            )}
            <View className='flex items-end'>
                <Text className='text-sm text-gray-400'>{dayjs(review.createdAt).fromNow()}</Text>
            </View>
        </View>
    )
}

const RatingBar = ({ rateDistribution, averageRating = 0 }: { averageRating: number, rateDistribution?: IRateDistribution }) => {
    if (!rateDistribution) return null;

    const totalReviews = Object.values(rateDistribution).reduce((a, b) => a + b, 0);

    return (
        <View style={{
            backgroundColor: '#f9fafb',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16
        }}>
            <Text className="text-center font-medium text-2xl">
                {averageRating} ⭐
            </Text>
            {[5, 4, 3, 2, 1].map((rating) => {
                const count = rateDistribution[rating as keyof IRateDistribution];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                    <View
                        key={rating}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8
                        }}
                    >
                        <Text style={{ marginRight: 8 }}>{rating} ⭐</Text>
                        <View style={{
                            flex: 1,
                            backgroundColor: '#e5e7eb',
                            borderRadius: 20,
                            height: 8
                        }}>
                            <View
                                style={{
                                    backgroundColor: '#eab308',
                                    borderRadius: 20,
                                    height: 8,
                                    width: `${percentage}%`
                                }}
                            />
                        </View>
                        <Text style={{
                            marginLeft: 8,
                            color: '#6b7280'
                        }}>
                            {count}
                        </Text>
                    </View>
                )
            })}
        </View>
    )
}

const ReviewList = ({ slug }: { slug: string }) => {
    const dispatch = useAppDispatch()
    const [query, setQuery] = useState({
        page: 1,
        pageSize: 10
    });

    const { data, isLoading, isFetching } = useGetReviewsQuery(
        { ...query, slug },
        { skip: !slug }
    );

    useEffect(() => {
        if (data?.data) {
            dispatch(ReviewActions.setRateInfor({
                averageRating: data.averageRating || 0,
                totalRate: data.pagination?.totalItems || 0
            }))
        }
    }, [data?.data])

    const reviews = data?.data || [];
    const pagination = data?.pagination;
    const rateDistribution = data?.rateDistribution;
    const averageRating = data?.averageRating || 0;

    const handleNextPage = () => {
        if (pagination && pagination.page < pagination.totalPage) {
            setQuery(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const handlePrevPage = () => {
        if (pagination && pagination.page > 1) {
            setQuery(prev => ({ ...prev, page: prev.page - 1 }));
        }
    };

    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!reviews.length) {
        return (
            <View style={{
                backgroundColor: '#f9fafb',
                padding: 16,
                borderRadius: 8,
                alignItems: 'center'
            }}>
                <Text style={{ color: '#6b7280' }}>Chưa có đánh giá nào</Text>
            </View>
        );
    }

    return (
        <View>
            <RatingBar rateDistribution={rateDistribution} averageRating={averageRating} />

            <FlatList
                data={reviews}
                renderItem={({ item }) => <ReviewItem review={item} />}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListFooterComponent={
                    pagination && (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 16
                        }}>
                            <TouchableOpacity
                                onPress={handlePrevPage}
                                disabled={pagination.page === 1}
                                style={{
                                    marginRight: 16,
                                    opacity: pagination.page === 1 ? 0.5 : 1
                                }}
                            >
                                <Ionicons name="chevron-back" size={24} color="#333" />
                            </TouchableOpacity>

                            <Text style={{ color: '#666' }}>
                                Trang {pagination.page} / {pagination.totalPage}
                            </Text>

                            <TouchableOpacity
                                onPress={handleNextPage}
                                disabled={pagination.page === pagination.totalPage}
                                style={{
                                    marginLeft: 16,
                                    opacity: pagination.page === pagination.totalPage ? 0.5 : 1
                                }}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                    )
                }
            />

            {isFetching && (
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    alignItems: 'center'
                }}>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            )}
        </View>
    )
}

export default ReviewList