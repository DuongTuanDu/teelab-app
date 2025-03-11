// import React from 'react';
// import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { IProduct } from '@/redux/product/product.interface';
// import { Ionicons, Feather } from '@expo/vector-icons';
// import ProductItem from '../products/product.item';
// import ProductListItem from '../products/product.item';

// interface IProps {
//     products: IProduct[];
//     title?: string;
//     pagination?: {
//         page: number;
//         pageSize: number;
//         totalPage: number;
//         totalItems: number;
//     }
//     isPagination?: boolean;
//     isLoading?: boolean;
//     onPageChange?: (page: number) => void;
//     layout?: 'list' | 'grid';
//     onLayoutChange?: (layout: 'list' | 'grid') => void;
// }

// const ProductList = (props: IProps) => {
//     const {
//         products,
//         title,
//         pagination,
//         isPagination = false,
//         isLoading = false,
//         onPageChange,
//         layout = 'grid',
//         onLayoutChange,
//     } = props;

//     const renderPagination = () => {
//         if (!isPagination || !pagination || pagination.totalPage <= 1) return null;

//         const { page, totalPage } = pagination;
//         const maxButtons = 5;
//         const startPage = Math.max(1, Math.min(page - Math.floor(maxButtons / 2), totalPage - maxButtons + 1));
//         const endPage = Math.min(totalPage, startPage + maxButtons - 1);

//         const pageNumbers = [];
//         for (let i = startPage; i <= endPage; i++) {
//             pageNumbers.push(i);
//         }

//         return (
//             <View className="flex-row justify-center items-center mt-4 mb-6">
//                 {/* Previous Button */}
//                 <TouchableOpacity
//                     className={`h-8 w-8 rounded-full items-center justify-center mr-1 ${page === 1 ? 'opacity-50' : ''}`}
//                     onPress={() => page > 1 && onPageChange && onPageChange(page - 1)}
//                     disabled={page === 1}
//                 >
//                     <Ionicons name="chevron-back" size={16} color="#374151" />
//                 </TouchableOpacity>

//                 {/* Page Numbers */}
//                 {pageNumbers.map((pageNum) => (
//                     <TouchableOpacity
//                         key={`page-${pageNum}`}
//                         className={`h-8 w-8 rounded-full items-center justify-center mx-1 ${pageNum === page ? 'bg-blue-500' : 'bg-gray-200'}`}
//                         onPress={() => onPageChange && onPageChange(pageNum)}
//                     >
//                         <Text
//                             className={`text-sm font-medium ${pageNum === page ? 'text-white' : 'text-gray-700'}`}
//                         >
//                             {pageNum}
//                         </Text>
//                     </TouchableOpacity>
//                 ))}

//                 {/* Next Button */}
//                 <TouchableOpacity
//                     className={`h-8 w-8 rounded-full items-center justify-center ml-1 ${page === totalPage ? 'opacity-50' : ''}`}
//                     onPress={() => page < totalPage && onPageChange && onPageChange(page + 1)}
//                     disabled={page === totalPage}
//                 >
//                     <Ionicons name="chevron-forward" size={16} color="#374151" />
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     // Loading state
//     if (isLoading) {
//         return (
//             <View className="py-8 items-center justify-center">
//                 <ActivityIndicator size="large" color="#3B82F6" />
//                 <Text className="text-gray-500 mt-4">Đang tải...</Text>
//             </View>
//         );
//     }

//     // Empty state
//     if (products.length === 0 && !isLoading) {
//         return (
//             <View className="py-16 items-center justify-center">
//                 <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
//                 <Text className="text-gray-400 text-base mt-4">Không tìm thấy sản phẩm</Text>
//             </View>
//         );
//     }

//     // Grid Layout
//     const renderGridLayout = () => (
//         <FlatList
//             data={products}
//             renderItem={({ item }) => (<ProductItem product={item} />)}
//             keyExtractor={(item) => item._id}
//             numColumns={2}
//             columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 16 }}
//             ListFooterComponent={renderPagination}
//         />
//     );

//     // List Layout (horizontal scrolling for each row)
//     const renderListLayout = () => (
//         <FlatList
//             data={products}
//             renderItem={({ item }) => (<ProductListItem product={item} />)}
//             keyExtractor={(item) => item._id}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 16 }}
//             ListFooterComponent={renderPagination}
//         />
//     );

//     return (
//         <View className="px-4">
//             {/* Section Title, Results Count, and Layout Toggle */}
//             <View className="flex-row justify-between items-center py-4">
//                 {
//                     title && <Text className="text-lg font-bold text-gray-800">{title}</Text>
//                 }
//                 <View className="flex-row items-center">
//                     <Text className="text-sm text-gray-500 mr-4">
//                         {pagination ? `${pagination.totalItems} sản phẩm` : `${products.length} sản phẩm`}
//                     </Text>

//                     {onLayoutChange && (
//                         <View className="flex-row bg-gray-100 rounded-lg p-1">
//                             <TouchableOpacity
//                                 className={`p-1 rounded ${layout === 'grid' ? 'bg-white shadow' : ''}`}
//                                 onPress={() => onLayoutChange('grid')}
//                             >
//                                 <Feather name="grid" size={20} color={layout === 'grid' ? '#3B82F6' : '#6B7280'} />
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 className={`p-1 rounded ml-2 ${layout === 'list' ? 'bg-white shadow' : ''}`}
//                                 onPress={() => onLayoutChange('list')}
//                             >
//                                 <Feather name="list" size={20} color={layout === 'list' ? '#3B82F6' : '#6B7280'} />
//                             </TouchableOpacity>
//                         </View>
//                     )}
//                 </View>
//             </View>

//             {/* Products in selected layout */}
//             {layout === 'grid' ? renderGridLayout() : renderListLayout()}
//         </View>
//     );
// };

// export default ProductList;

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { IProduct } from '@/redux/product/product.interface';
import { Ionicons, Feather } from '@expo/vector-icons';
import ProductItem from '../products/product.item';

interface IProps {
    products: IProduct[];
    title?: string;
    pagination?: {
        page: number;
        pageSize: number;
        totalPage: number;
        totalItems: number;
    }
    isPagination?: boolean;
    isLoading?: boolean;
    onPageChange?: (page: number) => void;
    layout?: 'horizontal' | 'grid';
    onLayoutChange?: (layout: 'horizontal' | 'grid') => void;
}

const ProductList = (props: IProps) => {
    const {
        products,
        title,
        pagination,
        isPagination = false,
        isLoading = false,
        onPageChange,
        layout = 'grid',
        onLayoutChange,
    } = props;

    const renderPagination = () => {
        if (!isPagination || !pagination || pagination.totalPage <= 1) return null;

        const { page, totalPage } = pagination;
        const maxButtons = 5;
        const startPage = Math.max(1, Math.min(page - Math.floor(maxButtons / 2), totalPage - maxButtons + 1));
        const endPage = Math.min(totalPage, startPage + maxButtons - 1);

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <View className="flex-row justify-center items-center mt-4 mb-6">
                {/* Previous Button */}
                <TouchableOpacity
                    className={`h-8 w-8 rounded-full items-center justify-center mr-1 ${page === 1 ? 'opacity-50' : ''}`}
                    onPress={() => page > 1 && onPageChange && onPageChange(page - 1)}
                    disabled={page === 1}
                >
                    <Ionicons name="chevron-back" size={16} color="#374151" />
                </TouchableOpacity>

                {/* Page Numbers */}
                {pageNumbers.map((pageNum) => (
                    <TouchableOpacity
                        key={`page-${pageNum}`}
                        className={`h-8 w-8 rounded-full items-center justify-center mx-1 ${pageNum === page ? 'bg-blue-500' : 'bg-gray-200'}`}
                        onPress={() => onPageChange && onPageChange(pageNum)}
                    >
                        <Text
                            className={`text-sm font-medium ${pageNum === page ? 'text-white' : 'text-gray-700'}`}
                        >
                            {pageNum}
                        </Text>
                    </TouchableOpacity>
                ))}

                {/* Next Button */}
                <TouchableOpacity
                    className={`h-8 w-8 rounded-full items-center justify-center ml-1 ${page === totalPage ? 'opacity-50' : ''}`}
                    onPress={() => page < totalPage && onPageChange && onPageChange(page + 1)}
                    disabled={page === totalPage}
                >
                    <Ionicons name="chevron-forward" size={16} color="#374151" />
                </TouchableOpacity>
            </View>
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <View className="py-8 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-4">Đang tải...</Text>
            </View>
        );
    }

    // Empty state
    if (products.length === 0 && !isLoading) {
        return (
            <View className="py-16 items-center justify-center">
                <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-400 text-base mt-4">Không tìm thấy sản phẩm</Text>
            </View>
        );
    }

    // Grid Layout
    const renderGridLayout = () => (
        <FlatList
            data={products}
            renderItem={({ item }) => (<ProductItem product={item} />)}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListFooterComponent={renderPagination}
        />
    );

    // Horizontal Layout (ScrollView horizontal)
    const renderHorizontalLayout = () => {
        // Group products into rows
        const rows = [];
        for (let i = 0; i < products.length; i += Math.min(5, products.length)) {
            rows.push(products.slice(i, i + Math.min(5, products.length)));
        }

        return (
            <View>
                {rows.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} className="mb-4">
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 16 }}
                        >
                            {row.map((product) => (
                                <View key={product._id} className="mr-10" style={{ width: 160 }}>
                                    <ProductItem product={product} />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                ))}
                {isPagination && renderPagination()}
            </View>
        );
    };

    return (
        <View className="px-4">
            {/* Section Title, Results Count, and Layout Toggle */}
            <View className="flex-row justify-between items-center py-4">
                {
                    title && <Text className="text-lg font-bold text-gray-800">{title}</Text>
                }
                <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-4">
                        {pagination ? `${pagination.totalItems} sản phẩm` : `${products.length} sản phẩm`}
                    </Text>
                    
                    {onLayoutChange && (
                        <View className="flex-row bg-gray-100 rounded-lg p-1">
                            <TouchableOpacity 
                                className={`p-1 rounded ${layout === 'grid' ? 'bg-white shadow' : ''}`}
                                onPress={() => onLayoutChange('grid')}
                            >
                                <Feather name="grid" size={20} color={layout === 'grid' ? '#3B82F6' : '#6B7280'} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className={`p-1 rounded ml-2 ${layout === 'horizontal' ? 'bg-white shadow' : ''}`}
                                onPress={() => onLayoutChange('horizontal')}
                            >
                                <Ionicons name="menu-outline" size={20} color={layout === 'horizontal' ? '#3B82F6' : '#6B7280'} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* Products in selected layout */}
            {layout === 'grid' ? renderGridLayout() : renderHorizontalLayout()}
        </View>
    );
};

export default ProductList;