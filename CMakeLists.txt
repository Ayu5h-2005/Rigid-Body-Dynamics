cmake_minimum_required(VERSION 3.20)
project(BilliardsRigidBodyDynamics LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# SFML 3 packages Graphics, Window, System
find_package(SFML 3 COMPONENTS Graphics Window System REQUIRED)

add_executable(billiards main.cpp)

target_link_libraries(billiards PRIVATE
    SFML::Graphics
    SFML::Window
    SFML::System
)

if(MSVC)
    target_compile_options(billiards PRIVATE /W4 /O2)
else()
    target_compile_options(billiards PRIVATE -Wall -Wextra -O2)
endif()
