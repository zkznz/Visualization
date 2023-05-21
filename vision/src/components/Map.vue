<template>
    <div class="container">
        <div class="chart" ref="chart" @dblclick="backMap">
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
    name: 'Map',
    data() {
        return {
            chart: null,
            allData: [],
            seriesArr: [],
            legendData: [],
            //省份矢量坐标
            mapData: {},
            titleFontSize: 0
        };
    },
    async mounted() {
        await this.initChart()
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
            //监听点击地图事件
            this.chart.on('click', async arg => {
                const provinceInfo = getProvinceMapInfo(arg.name);
                if (!this.mapData[provinceInfo.key]) {
                    let res = await axios.get("http://localhost:8080" + provinceInfo.path);
                    this.mapData[provinceInfo.key] = res.data;
                    this.$echarts.registerMap(provinceInfo.key, this.mapData[provinceInfo.key]);
                }
                let changeOption = {
                    geo: {
                        map: provinceInfo.key
                    }
                }
                this.chart.setOption(changeOption);
            })
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
            const titleFontSize = this.$refs.chart.offsetWidth / 100 * 3.6;
            let adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                legend: {
                    itemWidth: titleFontSize / 2,
                    itemHeight: titleFontSize / 2,
                    itemGap: titleFontSize / 2,
                    textStyle: {
                        fontSize: titleFontSize / 2
                    }
                },
            };
            this.chart.setOption(adapterOption);
            this.chart.resize();
        },
        //双击返回中国地图
        backMap() {
            this.chart.setOption({
                geo: {
                    map: 'china'
                }
            })
        }
    },
};
</script>
<style lang="less" scoped></style>