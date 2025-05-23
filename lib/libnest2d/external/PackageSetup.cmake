set(RP_INSTALL_PREFIX "${CMAKE_CURRENT_BINARY_DIR}/destdir/" CACHE STRING "")

set(RP_Boost_VERSION 1.70)

set (RP_OpenVDB_COMPONENTS openvdb)
set (RP_wxWidgets_VERSION 3.1.3)

if (NOT BUILD_SHARED_LIBS)
    set(TBB_STATIC ON)
endif ()

set(RP_ALL_TARGETS ${RP_PACKAGES})
