import Loading from "@/components/loading";
import { useAppSelector } from "@/hooks/useRedux";
import { useGetProductHomeQuery } from "@/redux/product/product.query";
import React, { useState } from "react";
import { Dimensions, Image, View, StyleSheet, Text } from "react-native";
import Carousel from 'react-native-reanimated-carousel';
import { Slide, slides } from "../../const";
import ProductList from "@/components/products/product.list";
import { ScrollView } from "react-native";

const { width } = Dimensions.get("window");

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { categories } = useAppSelector(state => state.category)
  const slugs = categories?.map((item) => item.slug);

  const { data, isLoading } = useGetProductHomeQuery(slugs.join(","), {
    skip: !slugs || !categories.length
  })

  const dataProductHome = data?.data || []

  if (isLoading) return <Loading />

  // Render carousel item
  const renderItem = ({ item }: { item: Slide; index: number }) => {
    return (
      <View style={styles.slideContainer}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={width}
            height={200}
            autoPlay={true}
            data={slides}
            scrollAnimationDuration={1000}
            autoPlayInterval={3000}
            onSnapToItem={(index) => setActiveIndex(index)}
            renderItem={renderItem}
          />

          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor: index === activeIndex
                      ? 'rgba(0, 0, 0, 0.8)'
                      : 'rgba(0, 0, 0, 0.3)'
                  }
                ]}
              />
            ))}
          </View>
        </View>
        <View className="space-y-1">
          <Text className="text-3xl text-center font-bold mt-4">
            Enjoy Your Youth!
          </Text>
          <View className="text-center px-4 w-full flex items-center justify-center">
            <Text className="w-full py-2 text-center">
              Không chỉ là thời trang, TEELAB còn là "phòng thí nghiệm" của tuổi
              trẻ - nơi nghiên cứu và cho ra đời nguồn năng lượng mang tên
              "Youth". Chúng mình luôn muốn tạo nên những trải nghiệm vui vẻ, năng
              động và trẻ trung.
            </Text>
          </View>
        </View>
        {
          dataProductHome.length > 0 &&
          dataProductHome.map((item, index) => {
            if (item.products.length > 0) {
              return (
                <React.Fragment key={item.category._id || index}>
                  <ProductList
                    isLoading={isLoading}
                    title={item.category.name}
                    products={item?.products}
                    isPagination={false}
                  />
                </React.Fragment>
              );
            }
            return null;
          })
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  carouselContainer: {
    marginTop: 10,
  },
  slideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.05, // 5% padding on each side
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});