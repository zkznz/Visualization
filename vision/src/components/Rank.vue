<template>
    <div class="container">
        <div class="chart" ref="chart">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Rank',
    data() {
        return {
            chart: null,
            allData: [],
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
        initChart() {
            this.chart = this.$echarts.init(this.$refs.chart, 'dark');
            let initOption = {
                title: {
                    text: '▎ 地区销售排行',
                    left: 20,
                    top: 20
                },
                grid: {
                    top: '40%',
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    type: 'bar'
                }],
                tooltip: {
                    show: true
                }
            };
            this.chart.setOption(initOption);
        },
        //获取数据
        async getData() {
            let { data: res } = await this.$http({
                url: '/rank'
            });
            this.allData = res;
            this.allData.sort((a, b) => b.value - a.value);
            this.updateChart();
        },
        //更新图表
        updateChart() {
            const colorArr = [
                ['#0BA82C', '#4FF778'],
                ['#2E72BF', '#23E5E5'],
                ['#5052EE', '#AB6EE5']
            ]
            const provinceArr = this.allData.map(item => item.name);
            const valueArr = this.allData.map(item => item.value);
            let dataOption = {
                xAxis: {
                    data: provinceArr
                },
                series: [
                    {
                        data: valueArr,
                        itemStyle: {
                            color(arg) {
                                let targetColorArr = null
                                if (arg.value > 300)
                                    targetColorArr = colorArr[0];
                                else if (arg.value > 200)
                                    targetColorArr = colorArr[1];
                                else
                                    targetColorArr = colorArr[2];
                                return {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0, color: targetColorArr[0] // 0% 处的颜色
                                    }, {
                                        offset: 1, color: targetColorArr[1] // 100% 处的颜色
                                    }],

                                }
                            }
                        }
                    }
                ]
            };
            this.chart.setOption(dataOption);
        },
        //图表适配
        screenAdapter() {
            this.titleFontSize = this.$refs.chart.offsetWidth * 100 / 3.6;
            let adapterOption = {

            };
            this.chart.setOption(adapterOption);
            this.chart.resize();
        }
    },
};
</script>
<style lang="less" scoped></style>