cmake_minimum_required(VERSION 3.1)

project(Libnest2D)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED)

# Add our own cmake module path.
list(APPEND CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake_modules/)

include(RequirePackage)

option(LIBNEST2D_BUILD_UNITTESTS "If enabled, googletest framework will be downloaded
    and the provided unit tests will be included in the build." OFF)

option(BUILD_SHARED_LIBS "Build shared libs instead of static (applies for dependencies as well)" OFF)

option(LIBNEST2D_HEADER_ONLY "If enabled static library will not be built." ON)

set(GEOMETRY_BACKENDS clipper boost eigen)
set(LIBNEST2D_GEOMETRIES clipper CACHE STRING "Geometry backend")
set_property(CACHE LIBNEST2D_GEOMETRIES PROPERTY STRINGS ${GEOMETRY_BACKENDS})
list(FIND GEOMETRY_BACKENDS ${LIBNEST2D_GEOMETRIES} GEOMETRY_TYPE)
if(${GEOMETRY_TYPE} EQUAL -1)
    message(FATAL_ERROR "Option ${LIBNEST2D_GEOMETRIES} not supported, valid entries are ${GEOMETRY_BACKENDS}")
endif()

set(OPTIMIZERS nlopt optimlib)
set(LIBNEST2D_OPTIMIZER nlopt CACHE STRING "Optimization backend")
set_property(CACHE LIBNEST2D_OPTIMIZER PROPERTY STRINGS ${OPTIMIZERS})
list(FIND OPTIMIZERS ${LIBNEST2D_OPTIMIZER} OPTIMIZER_TYPE)
if(${OPTIMIZER_TYPE} EQUAL -1)
    message(FATAL_ERROR "Option ${LIBNEST2D_OPTIMIZER} not supported, valid entries are ${OPTIMIZERS}")
endif()

set(THREADING std tbb omp none)
set(LIBNEST2D_THREADING std CACHE STRING "Multithreading")
set_property(CACHE LIBNEST2D_THREADING PROPERTY STRINGS ${THREADING})
list(FIND THREADING ${LIBNEST2D_THREADING} THREADING_TYPE)
if(${THREADING_TYPE} EQUAL -1)
    message(FATAL_ERROR "Option ${LIBNEST2D_THREADING} not supported, valid entries are ${THREADING}")
endif()

add_library(libnest2d_headeronly INTERFACE)

set(SRC_DIR ${PROJECT_SOURCE_DIR}/include)

set(LIBNEST2D_SRCFILES
    include/libnest2d/libnest2d.hpp
    include/libnest2d/nester.hpp
    include/libnest2d/geometry_traits.hpp
    include/libnest2d/geometry_traits_nfp.hpp
    include/libnest2d/common.hpp
    include/libnest2d/parallel.hpp
    include/libnest2d/optimizer.hpp
    include/libnest2d/utils/metaloop.hpp
    include/libnest2d/utils/rotfinder.hpp
    include/libnest2d/utils/rotcalipers.hpp
    include/libnest2d/utils/bigint.hpp
    include/libnest2d/utils/rational.hpp
    include/libnest2d/utils/boost_alg.hpp
    include/libnest2d/placers/placer_boilerplate.hpp
    include/libnest2d/placers/bottomleftplacer.hpp
    include/libnest2d/placers/nfpplacer.hpp
    include/libnest2d/selections/selection_boilerplate.hpp
    include/libnest2d/selections/filler.hpp
    include/libnest2d/selections/firstfit.hpp
    include/libnest2d/selections/djd_heuristic.hpp
    )

set(LIBNEST2D_PUBLIC_PACKAGES "" CACHE INTERNAL "")

if(NOT ${LIBNEST2D_THREADING} STREQUAL "none")
    include(threading_${LIBNEST2D_THREADING})
    target_link_libraries(libnest2d_headeronly INTERFACE ${LIBNEST2D_THREADING}Threading)
    target_compile_definitions(libnest2d_headeronly INTERFACE LIBNEST2D_THREADING_${LIBNEST2D_THREADING})
endif()

add_subdirectory(${SRC_DIR}/libnest2d/backends/${LIBNEST2D_GEOMETRIES})
target_link_libraries(libnest2d_headeronly INTERFACE ${LIBNEST2D_GEOMETRIES}Backend)
target_compile_definitions(libnest2d_headeronly INTERFACE LIBNEST2D_GEOMETRIES_${LIBNEST2D_GEOMETRIES})

add_subdirectory(${SRC_DIR}/libnest2d/optimizers/${LIBNEST2D_OPTIMIZER})
target_link_libraries(libnest2d_headeronly INTERFACE ${LIBNEST2D_OPTIMIZER}Optimizer)
target_compile_definitions(libnest2d_headeronly INTERFACE LIBNEST2D_OPTIMIZER_${LIBNEST2D_OPTIMIZER})

target_include_directories(libnest2d_headeronly INTERFACE $<BUILD_INTERFACE:${SRC_DIR}>)

set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)

add_library(libnest2d INTERFACE)

if(NOT LIBNEST2D_HEADER_ONLY)
    set(LIBNAME libnest2d_${LIBNEST2D_GEOMETRIES}_${LIBNEST2D_OPTIMIZER})
    add_library(${LIBNAME} ${PROJECT_SOURCE_DIR}/src/libnest2d.cpp)
    set_target_properties(${LIBNAME} PROPERTIES PREFIX "")
    set_target_properties(${LIBNAME} PROPERTIES DEBUG_POSTFIX "d")
    target_link_libraries(${LIBNAME} PUBLIC libnest2d_headeronly)
    target_compile_definitions(${LIBNAME} PUBLIC LIBNEST2D_STATIC)
    target_sources(${LIBNAME} PRIVATE ${LIBNEST2D_SRCFILES})
    
    target_link_libraries(libnest2d INTERFACE ${LIBNAME})
else()
    target_link_libraries(libnest2d INTERFACE libnest2d_headeronly)
endif()

if(LIBNEST2D_BUILD_UNITTESTS)
    enable_testing()
    add_subdirectory(${PROJECT_SOURCE_DIR}/tests)
endif()

include(CMakePackageConfigHelpers)

write_basic_package_version_file(
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}ConfigVersion.cmake"     
    VERSION 1.0
    COMPATIBILITY AnyNewerVersion
)

export(EXPORT ${PROJECT_NAME}Targets 
       FILE "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}Targets.cmake" 
       NAMESPACE ${PROJECT_NAME}::)

install(TARGETS libnest2d libnest2d_headeronly ${LIBNAME} 
  EXPORT ${PROJECT_NAME}Targets
  RUNTIME DESTINATION bin 
  ARCHIVE DESTINATION lib
  LIBRARY DESTINATION lib
  INCLUDES DESTINATION include)

configure_file(cmake_modules/Config.cmake.in
  "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}Config.cmake"
  @ONLY
)

set(ConfigPackageLocation lib/cmake/${PROJECT_NAME})

install(EXPORT ${PROJECT_NAME}Targets
  FILE
    ${PROJECT_NAME}Targets.cmake
  NAMESPACE
    ${PROJECT_NAME}::
  DESTINATION
    ${ConfigPackageLocation}
)

foreach (srcfile IN ITEMS ${LIBNEST2D_SRCFILES})
  get_filename_component(srcfile_dir ${srcfile} DIRECTORY)
  install(
    FILES
      ${PROJECT_SOURCE_DIR}/${srcfile} 
    DESTINATION
      ${srcfile_dir}
    COMPONENT
      Devel
  )
endforeach()

install(
  FILES
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}Config.cmake"
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}ConfigVersion.cmake"
    "${CMAKE_CURRENT_SOURCE_DIR}/cmake_modules/FindClipper.cmake"
    "${CMAKE_CURRENT_SOURCE_DIR}/cmake_modules/FindNLopt.cmake"
    "${CMAKE_CURRENT_SOURCE_DIR}/cmake_modules/FindTBB.cmake"
  DESTINATION
    ${ConfigPackageLocation}
  COMPONENT
    Devel
)

rp_install_versions_file(${ConfigPackageLocation})

foreach(p ${LIBNEST2D_PUBLIC_PACKAGES})
    set(_pkgstr "${_pkgstr} ${p}")
endforeach()
message(STATUS "Installed Libnest2DConfig.cmake will require packages:${_pkgstr}")

