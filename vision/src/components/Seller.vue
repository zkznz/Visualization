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
            chart: null
        };
    },
    mounted() {
        this.initCharts();
    },
    methods: {
        //初始化echarts实例
        initCharts() {
            this.chart = this.$echarts.init(this.$refs.chart);
        }
    },
};
</script>
<style lang="less" scoped></style>