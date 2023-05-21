<template>
    <div class="container">
        <div class="chart" ref="chart">
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Map',
    data() {
        return {
            chart: null,
            allData: [],
            seriesArr: [],
            legendData: [],
            titleFontSize: 0
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
        async initChart() {
            let res = await axios.get("http://localhost:8080/static/map/china.json");
            this.$echarts.registerMap('china', res.data);

            this.chart = this.$echarts.init(this.$refs.chart, 'dark');
            let initOption = {
                geo: {
                    type: 'map',
                    map: 'china',
                    top: '5%',
                    bottom: '5%',
                    itemStyle: {
                        areaColor: '#2E72BF',
                        borderColor: '#333'
                    }
                },
                title: {
                    text: '▎商家分布',
                    top: 20,
                    left: 20
                },
                legend: {
                    left: '3%',
                    bottom: '3%',
                    orient: 'vertical'
                }
            };
            this.chart.setOption(initOption);
        },
        //获取数据
        async getData() {
            let { data: res } = await this.$http({
                url: '/map'
            });
            this.allData = res;
            this.seriesArr = this.allData.map(item => {
                return {
                    type: 'effectScatter',
                    name: item.name,
                    data: item.children,
                    coordinateSystem: 'geo',
                    rippleEffect: {
                        scale: 5,
                        brushType: 'stroke'
                    }
                }
            })
            this.legendData = this.allData.map(item => item.name);
            this.updateChart();
        },
        //更新图表
        updateChart() {
            let dataOption = {
                series: this.seriesArr,
                legend: {
                    data: this.legendData
                }
            };
            this.chart.setOption(dataOption);
        },
        //图表适配
        screenAdapter() {
            this.titleFontSize = this.$refs.chart.offsetWidth * 100 / 3.6;
            let adapterOption = {

            };
            // this.chart.setOption(adapterOption);
            // this.chart.resize();
        }
    },
};
</script>
<style lang="less" scoped></style>