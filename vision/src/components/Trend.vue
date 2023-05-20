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
            this.chart = this.$echarts.init(this.$refs.chart);
            let initOption = {
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value'
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
                    stack: 'map'
                }
            })
            let legendArr = valueArr.map(item => {
                return item.name
            });
            console.log(legendArr);
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