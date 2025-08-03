import { createClient } from "../utils/supabase/server";

export async function Categories() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('categories').select();

    return (
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Explore Categories
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our wide range of products across different categories
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Categories Grid - Horizontal scroll on mobile, grid on larger screens */}
                <div className="flex overflow-x-auto gap-4 pb-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:gap-6 scrollbar-hide categories-scroll px-2 sm:px-0">
                    {categories?.map((category) => (
                        <div 
                            key={category.id}
                            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-blue-200 flex-shrink-0 w-40 sm:w-auto"
                        >
                            {/* Background Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            
                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Image Container */}
                                <div className="relative mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <img 
                                            src={category.image_url} 
                                            alt={category.name}
                                            className="w-10 h-10 object-contain filter group-hover:brightness-110 transition-all duration-300"
                                        />
                                    </div>
                                    {/* Decorative ring */}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                                </div>

                                {/* Category Name */}
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors duration-300">
                                    {category.name}
                                </h3>

                                {/* Hover Arrow */}
                                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Subtle border animation */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300"></div>
                        </div>
                    )                )}
            </div>

            {/* Loading State Skeleton */}
            {(!categories || categories.length === 0) && (
                <div className="flex overflow-x-auto gap-4 pb-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:gap-6 scrollbar-hide px-2 sm:px-0">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse flex-shrink-0 w-40 sm:w-auto">
                            <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </section>
    )
}