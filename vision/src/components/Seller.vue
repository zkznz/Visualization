<template>
    <div class="container">
        <div class="chart" ref="chart">

        </div>
    </div>
</template>

<script>

export default {
    name: 'Seller',
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
        this.initCharts();
        this.getData();
    },
    destroyed() {
        clearInterval(this.timer);
    },
    methods: {
        //初始化echarts实例
        initCharts() {
            this.chart = this.$echarts.init(this.$refs.chart);
            this.chart.on('mouseover', () => clearInterval(this.timer))
            this.chart.on('mouseout', () => this.startInterval())
        },
        //获取数据
        async getData() {
            let { data: res } = await this.$http({
                url: '/seller',
                method: 'get'
            })
            this.allData = res;
            this.allData.sort((a, b) => a.value - b.value);
            this.totalPage = res.length % 5 === 0 ? res.length / 5 : Math.ceil(res.length / 5);
            this.updateChart();
            this.startInterval();
        },
        //更新图表
        updateChart() {
            //起始下标
            let start = (this.currentPage - 1) * 5;
            //结束下标
            let end = this.currentPage * 5;
            let showData = this.allData.slice(start, end);
            let sellerNames = showData.map(item => item.name);
            let sellerValue = showData.map(item => item.value);
            let option = {
                xAxis: {
                    type: 'value',
                },
                yAxis: {
                    type: 'category',
                    data: sellerNames
                },
                series: [
                    {
                        type: 'bar',
                        data: sellerValue
                    }
                ]
            }
            this.chart.setOption(option);
        },
        startInterval() {
            if (this.timer);
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.currentPage = this.currentPage >= this.totalPage ? 1 : ++this.currentPage;
                this.updateChart();
            }, 3000)
        }
    },
};
</script>
<style lang="less" scoped></style>