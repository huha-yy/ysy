import { useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import AMapLoader from '@amap/amap-jsapi-loader'

interface AMapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    title?: string
    icon?: string
  }>
  onMapClick?: (e: any) => void
  onLocationComplete?: (position: { lng: number; lat: number }) => void
  style?: React.CSSProperties
  className?: string
}

const AMap: React.FC<AMapProps> = ({
  center = [116.397428, 39.90923],
  zoom = 10,
  markers = [],
  onMapClick,
  onLocationComplete,
  style,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lng: number; lat: number } | null>(null)
  const [loading, setLoading] = useState(true)

  // 初始化地图
  useEffect(() => {
    const initMap = async () => {
      try {
        // 加载高德地图
        await AMapLoader.load({
          key: '4e498e7dde5c0916ebd506fb723f1706', // 需要替换为实际的密钥
          version: '2.0',
          plugins: ['AMap.Geolocation', 'AMap.Marker', 'AMap.Polyline'],
        })

        if (!mapRef.current) return

        // 创建地图实例
        const mapInstance = new (window as any).AMap.Map(mapRef.current, {
          center,
          zoom,
          viewMode: '2D',
        })

        // 添加点击事件
        if (onMapClick) {
          mapInstance.on('click', onMapClick)
        }

        // 获取当前位置
        const geolocation = new (window as any).AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
        })

        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete') {
            const position = {
              lng: result.position.getLng(),
              lat: result.position.getLat(),
            }
            setCurrentLocation(position)
            
            // 添加当前位置标记
            const marker = new (window as any).AMap.Marker({
              position: [position.lng, position.lat],
              icon: new (window as any).AMap.Icon({
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                size: new (window as any).AMap.Size(25, 34),
              }),
            })
            
            mapInstance.add(marker)
            mapInstance.setCenter([position.lng, position.lat])
            
            if (onLocationComplete) {
              onLocationComplete(position)
            }
            
            message.success('定位成功')
          } else {
            message.error('定位失败，请检查定位权限')
          }
        })

        setMap(mapInstance)
        setLoading(false)
      } catch (error) {
        console.error('地图加载失败:', error)
        message.error('地图加载失败')
        setLoading(false)
      }
    }

    initMap()
  }, [])

  // 更新标记点
  useEffect(() => {
    if (!map) return

    // 清除所有标记
    map.clearMap()

    // 添加新标记
    markers.forEach(marker => {
      const mapMarker = new (window as any).AMap.Marker({
        position: marker.position,
        title: marker.title,
      })
      
      map.add(mapMarker)
    })
  }, [map, markers])

  // 绘制路线
  const drawPath = (path: Array<[number, number]>) => {
    if (!map) return

    const polyline = new (window as any).AMap.Polyline({
      path,
      strokeColor: '#3366FF',
      strokeWeight: 5,
    })

    map.add(polyline)
  }

  // 计算两点距离
  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    if (!map) return 0

    const p1 = new (window as any).AMap.LngLat(point1[0], point1[1])
    const p2 = new (window as any).AMap.LngLat(point2[0], point2[1])
    return Math.round(p1.distance(p2))
  }

  // 暴露地图实例方法
  useEffect(() => {
    if (map) {
      (window as any).mapInstance = map
      ;(window as any).drawPath = drawPath
      ;(window as any).calculateDistance = calculateDistance
    }
  }, [map])

  return (
    <div
      ref={mapRef}
      className={`amap-container ${className || ''}`}
      style={{ 
        width: '100%', 
        height: '400px', 
        ...style 
      }}
    >
      {loading && (
        <div className="amap-loading">
          <div>地图加载中...</div>
        </div>
      )}
    </div>
  )
}

export default AMap
