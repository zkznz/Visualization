<template>
    <div class="container">
        <div class="chart" ref="chart">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Stock',
    data() {
        return {
            chart: null,
            allData: null,
        };
    },
    mounted() {
        this.initChart();
        this.getData();
        window.addEventListener('resize', this.screenAdapter);
        this.screenAdapter();
    },
    destroyed() {
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        initChart() {
            this.chart = this.$echarts.init(this.$refs.chart);
            let initOption = {
                title: {
                    text: '▎库存销售量',
                    top: 20,
                    left: 20
                },
            };
            this.chart.setOption(initOption);
        },
        //获取数据
        async getData() {
            let { data: res } = await this.$http({
                url: '/stock'
            });
            this.allData = res;
            this.updateChart();
        },
        //更新图表
        updateChart() {
            const centerArr = [
                ['18%', '40%'],
                ['50%', '40%'],
                ['82%', '40%'],
                ['34%', '75%'],
                ['66%', '75%']
            ]
            const colorArr = [
                ['#4FF778', '#0BA82C'],
                ['#E5DD45', '#E8B11C'],
                ['#E8821C', '#E55445'],
                ['#5052EE', '#AB6EE5'],
                ['#23E5E5', '#2E72BF']
            ]
            const dateArr = this.allData.slice(0, 5)

            const seriesArr = dateArr.map((item, index) => {
                return {
                    type: 'pie',
                    radius: [110, 100],
                    center: centerArr[index],
                    data: [
                        { value: item.sales },
                        { value: item.stock }
                    ]

                }
            })
            let dataOption = {
                series: seriesArr
            };
            this.chart.setOption(dataOption);
        },
        //图表适配
        screenAdapter() {
            let titleFontSize = this.$refs.chart.offsetWidth / 100 * 3.6;
            let adapterOption = {

            };
            this.chart.setOption(adapterOption);
            this.chart.resize();
        }
    },
};
</script>
<style lang="less" scoped></style>