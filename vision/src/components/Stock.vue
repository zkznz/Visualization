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
            currentPage: 1,
            timer: null
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
        clearInterval(this.timer);
    },
    methods: {
        initChart() {
            this.chart = this.$echarts.init(this.$refs.chart, 'dark');
            let initOption = {
                title: {
                    text: '▎库存销售量',
                    top: 20,
                    left: 20
                },
            };
            this.chart.setOption(initOption);
            this.chart.on('mouseover', () => clearInterval(this.timer))
            this.chart.on('mouseout', () => this.startInterval())
        },
        //获取数据
        async getData() {
            let { data: res } = await this.$http({
                url: '/stock'
            });
            this.allData = res;
            this.updateChart();
            this.startInterval();
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
            const start = (this.currentPage - 1) * 5;
            const end = this.currentPage * 5;
            const dateArr = this.allData.slice(start, end)
            const seriesArr = dateArr.map((item, index) => {
                return {
                    type: 'pie',
                    radius: [110, 100],
                    center: centerArr[index],
                    data: [
                        {
                            name: item.name + '\n' + item.sales,
                            value: item.sales,
                            itemStyle: {
                                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                    {
                                        offset: 0,
                                        color: colorArr[index][0]
                                    },
                                    {
                                        offset: 1,
                                        color: colorArr[index][1]
                                    }
                                ])
                            }
                        },
                        {
                            name: item.name + '\n' + item.sales,
                            value: item.stock,
                            itemStyle: {
                                color: '#333843'
                            }
                        }
                    ],
                    labelLine: {
                        show: false
                    },
                    label: {
                        color: colorArr[index][0],
                        position: 'center'
                    },
                    emphasis: {
                        scale: false// 关闭鼠标移入到饼图时的动画效果
                    },
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
            const innerRadius = titleFontSize * 2
            const outterRadius = innerRadius * 1.125
            let adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: [outterRadius, innerRadius],
                        label: {
                            fontSize: titleFontSize / 2
                        }
                    },
                    {
                        type: 'pie',
                        radius: [outterRadius, innerRadius],
                        label: {
                            fontSize: titleFontSize / 2
                        }
                    },
                    {
                        type: 'pie',
                        radius: [outterRadius, innerRadius],
                        label: {
                            fontSize: titleFontSize / 2
                        }
                    },
                    {
                        type: 'pie',
                        radius: [outterRadius, innerRadius],
                        label: {
                            fontSize: titleFontSize / 2
                        }
                    },
                    {
                        type: 'pie',
                        radius: [outterRadius, innerRadius],
                        label: {
                            fontSize: titleFontSize / 2
                        }
                    }
                ]
            };
            this.chart.setOption(adapterOption);
            this.chart.resize();
        },
        startInterval() {
            if (this.timer)
                clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.currentPage = this.currentPage >= this.allData.length / 5 ? 1 : ++this.currentPage;
                this.updateChart();
            }, 5000)
        }
    },
};
</script>
<style lang="less" scoped></style>