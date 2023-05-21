<template>
    <div class="container">
        <div class="chart" ref="chart">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Map',
    data() {
        return {
            chart: null,
            allData: [],
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

            };
            this.chart.setOption(initOption);
        },
        //获取数据
        async getData() {
            let { data: res } = await this.$http({
                url: '/map'
            });
            this.allData = res;
        },
        //更新图表
        updateChart() {
            let dataOption = {

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