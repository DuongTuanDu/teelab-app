import CustomButton from "@/components/custombutton";
import { statusColors, statusTranslations } from "@/const";
import { formatPrice } from "@/helpers/formatPrice";
import { IOrder } from "@/redux/order/order.interface";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";

interface IProps {
    order: IOrder;
    onPressReview: (orderId: string, productId: string) => void;
    onPressComplete: (orderId: string) => void;
    onPressCancel: (orderId: string) => void;
}


const OrderItem = ({ order, onPressReview, onPressComplete, onPressCancel }: IProps) => {
    const status = order.status;
    const formattedDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <TouchableOpacity
            className="bg-white mb-3 rounded-lg shadow-sm overflow-hidden border border-gray-100"
        >
            {/* Order header */}
            <View className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                <View className="flex-row items-center">
                    <Feather name="shopping-bag" size={16} color="#4B5563" />
                    <Text className="ml-2 font-medium text-gray-800 uppercase">Đơn #{order._id.substring(order._id.length - 8)}</Text>
                </View>
                <View
                    style={{ backgroundColor: statusColors[status].bg }}
                    className="px-3 py-1 rounded-full"
                >
                    <Text style={{ color: statusColors[status].text }} className="text-xs font-medium">
                        {statusTranslations[status]}
                    </Text>
                </View>
            </View>

            {/* Order products */}
            <View className="p-4">
                {order.products.slice(0, 2).map((product, index) => (
                    <View key={`${order._id}-${index}`} className="flex-row mb-3">
                        <Image
                            source={{ uri: product.image }}
                            className="w-16 h-16 rounded-md bg-gray-100"
                        />
                        <View className="ml-3 flex-1 justify-center">
                            <Text className="font-medium text-gray-800" numberOfLines={1}>{product.name}</Text>
                            <Text className="text-gray-500 text-xs mt-1">
                                {product.size && `Size: ${product.size}`}
                                {product.color && ` | Màu: ${product.color}`}
                            </Text>
                            <View className="flex-row justify-between mt-1">
                                <Text className="text-gray-600">{formatPrice(parseInt(product.price))} x {product.quantity}</Text>
                            </View>
                        </View>
                    </View>
                ))}

                {order.products.length > 2 && (
                    <Text className="text-gray-500 text-center mt-1">
                        +{order.products.length - 2} sản phẩm khác
                    </Text>
                )}

                {/* Order total */}
                <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between">
                    <Text className="text-gray-500">{order.products.reduce((sum, p) => sum + p.quantity, 0)} sản phẩm</Text>
                    <View className="flex-row">
                        <Text className="text-gray-500 mr-1">Tổng tiền:</Text>
                        <Text className="font-bold text-gray-800">{formatPrice(order.totalAmount)}đ</Text>
                    </View>
                </View>

                {/* Order date */}
                <Text className="text-xs text-gray-500 mt-3">Đặt hàng: {formattedDate}</Text>

                {/* Order actions */}
                <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-100">
                    {status === 'pending' || status === 'processing' && (
                        <CustomButton
                            label="Hủy đơn"
                            onPress={() => onPressCancel(order._id)}
                            variant="danger"
                        />
                    )}

                    {status === 'shipping' && (
                        <CustomButton
                            label="Đã nhận hàng"
                            onPress={() => onPressComplete(order._id)}
                            variant="primary"
                        />
                    )}

                    {status === 'delivered' && order.products.some(p => !p.isReviewed) && (
                        <View className="flex-row">
                            {order.products.filter(p => !p.isReviewed).map((product) => (
                                <CustomButton
                                    key={`review-${product.productId}`}
                                    label="Đánh giá"
                                    onPress={() => onPressReview(order._id, product.productId)}
                                />
                            )).slice(0, 1)}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderItem