<template>
    <div class="container">
        <div class="chart" ref="chart">
            cc
        </div>
    </div>
</template>

<script>
export default {
    name: 'Trend',
    data() {
        return {
            chart: null,
            allData: [],
            timer: null,
            currentPage: 1,
            totalPage: 1,
        };
    },
    mounted() {
        this.initChart();
        this.getData();
    },
    methods: {
        initChart() {
            this.chart = this.$echarts.init(this.$refs.chart, 'dark');
            let initOption = {
                title: {
                    text: '▎地区销量趋势',
                    textStyle: {
                        fontSize: 60,
                    },
                    top: 40,
                    left: 20
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value'
                },
                legend: {
                    left: 20,
                    top: '15%',
                    icon: 'circle',
                    itemWidth: 50,
                    itemHeight: 50
                },
                grid: {
                    left: '3%',
                    top: '35%',
                    right: '4%',
                    bottom: '1%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                }
            }
            this.chart.setOption(initOption);
        },
        async getData() {
            let { data: res } = await this.$http({ url: '/trend', method: 'get' });
            this.allData = res;
            this.updateChart();
        },
        updateChart() {
            let timeArr = this.allData.common.month;
            let valueArr = this.allData.map.data;
            let seriesArr = valueArr.map(item => {
                return {
                    type: 'line',
                    name: item.name,
                    data: item.data,
                    stack: 'map',
                    smooth: 'true'
                }
            })
            let legendArr = valueArr.map(item => {
                return item.name
            });
            // 半透明的颜色值
            const colorArr1 = [
                'rgba(11, 168, 44, 0.5)',
                'rgba(44, 110, 255, 0.5)',
                'rgba(22, 242, 217, 0.5)',
                'rgba(254, 33, 30, 0.5)',
                'rgba(250, 105, 0, 0.5)'
            ]
            // 全透明的颜色值
            const colorArr2 = [
                'rgba(11, 168, 44, 0)',
                'rgba(44, 110, 255, 0)',
                'rgba(22, 242, 217, 0)',
                'rgba(254, 33, 30, 0)',
                'rgba(250, 105, 0, 0)'
            ]
            let dataOption = {
                xAxis: {
                    data: timeArr
                },
                legend: {
                    data: legendArr
                },
                series: seriesArr
            }
            this.chart.setOption(dataOption);
        },
        screenAdapter() {

        }
    },
};
</script>
<style lang="less" scoped></style>