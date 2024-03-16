#include <mach/mach_host.h>
#include <stdio.h>
#include <stdlib.h>
#include <mach/vm_statistics.h>
#include <sys/sysctl.h>

void getCpuEveryCoreInfo()
{
    mach_port_t host = mach_host_self();
    natural_t cpuNums = 8;

    mach_msg_type_number_t outProcessorInfoCnt = 0;
    processor_info_array_t cpuInfo = (processor_info_array_t)malloc(PROCESSOR_INFO_MAX * sizeof(integer_t));
    kern_return_t result = host_processor_info(host, PROCESSOR_CPU_LOAD_INFO, &cpuNums, &cpuInfo, &outProcessorInfoCnt);

    if (result == KERN_SUCCESS)
    {
        for (int i = 0; i < cpuNums; i++)
        {
            // 统计的时间都是时钟周期

            // cpu在高优先级用户态工作的时间
            int user = cpuInfo[CPU_STATE_MAX * i + CPU_STATE_USER];
            // cpu在内核态工作的时间
            int system = cpuInfo[CPU_STATE_MAX * i + CPU_STATE_SYSTEM];
            // cpu在低优先级用户态工作的时间
            int nice = cpuInfo[CPU_STATE_MAX * i + CPU_STATE_NICE];
            // cpu空闲的时间(不包括io等待)
            int idle = cpuInfo[CPU_STATE_MAX * i + CPU_STATE_IDLE];
            int total = user + system + nice + idle;
            double percentage = (double)(user + system + nice) / total;
            printf("cpu[%d]:\nuser: %d\nsystem: %d\nnice: %d\nidle: %d\npercentage: %.4f\n\n", i, user, system, nice, idle, percentage);
        }
    }
}

void getMemoryInfo()
{
    host_basic_info_data_t stats;
    u_int32_t count = (u_int32_t)(sizeof(host_basic_info_data_t) / sizeof(integer_t));
    kern_return_t result = host_info(mach_host_self(), HOST_BASIC_INFO, &stats, &count);
    uint64_t total = 0;

    // 内存总量
    if (result == KERN_SUCCESS)
    {
        total = stats.max_mem;
    }
    else
    {
        printf("error when get total size of memory\n");
        return;
    }

    vm_statistics64_data_t sstats;
    count = (u_int32_t)(sizeof(vm_statistics64_data_t) / sizeof(integer_t));
    result = host_statistics64(mach_host_self(), HOST_VM_INFO64, &sstats, &count);

    if (result == KERN_SUCCESS)
    {
        double active = (double)sstats.active_count * (double)vm_page_size;
        double inactive = (double)sstats.inactive_count * (double)vm_page_size;
        double speculative = (double)sstats.speculative_count * (double)vm_page_size;
        double wired = (double)sstats.wire_count * (double)vm_page_size;
        double compressed = (double)sstats.compressor_page_count * (double)vm_page_size;
        double purgeable = (double)sstats.purgeable_count * (double)vm_page_size;
        double external = (double)sstats.external_page_count * (double)vm_page_size;

        double used = active + inactive + speculative + wired + compressed - purgeable - external;
        double free = total - used;
        double app = used - wired - compressed;
        double cache = purgeable + external;

        struct xsw_usage swap;
        size_t stringSize = (size_t)sizeof(struct xsw_usage);
        int ok = sysctlbyname("vm.swapusage", &swap, &stringSize, NULL, 0);
        if (ok == 0)
        {
            u_int64_t swapTotal = swap.xsu_total;
            u_int64_t swapUsed = swap.xsu_used;
            u_int64_t swapFree = swap.xsu_avail;

            printf("memory:\n"
                   "total: %.2f GB\n"
                   "used: %.2f GB\n"
                   "free: %.2f GB\n"
                   "cache: %.2f GB\n"
                   "swapTotal: %lld\n"
                   "swapUsed: %lld\n"
                   "swapFree: %lld\n"
                   "app: %.2f GB\n"
                   "compress: %.2f GB\n"
                   "wired: %.2f GB\n",

                   (double)(total / (1 << 30)),
                   used / (1 << 30),
                   free / (1 << 30),
                   cache / (1 << 30),
                   swapTotal,
                   swapUsed,
                   swapFree,
                   app / (1 << 30),
                   compressed / (1 << 30),
                   wired / (1 << 30));
        }
    }
}

int main(int argc, char *argv[])
{
    if (argc == 1)
    {
        printf(
            "help message:\n"
            "command <number>\n"
            "\n"
            "<number>:\n"
            "1: getCpuCoreInfo\n"
            "2: getMemoryInfo\n");
        return 0;
    }

    char *ptr = argv[1];
    int n = atoi(ptr);

    switch (n)
    {
    case 1:
        getCpuEveryCoreInfo();
        break;
    case 2:
        getMemoryInfo();
        break;
    default:
    {
    }
    }

    return 0;
}
