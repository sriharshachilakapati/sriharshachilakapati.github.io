#include <iostream>
#include <cmath>

#define PIOVER180 0.01745329251994329576923690768489

class Point
{
    private:
        float _x, _y;
        
        Point(float x, float y) : _x(x), _y(y)
        {
        }
        
    public:
        static Point Rectangular(float x, float y)
        {
            return Point(x, y);
        }
        
        static Point Polar(float r, float t)
        {
            return Point(r * std::cos(t), r * std::sin(t));
        }
        
        float getX() const { return _x; }
        float getY() const { return _y; }
};
    
int main()
{
    using namespace std;
    
    Point p1 = Point::Rectangular(3, 4);
    Point p2 = Point::Polar(5, 45 * PIOVER180);
    
    cout << "P1 = " << p1.getX() << ", " << p1.getY() << endl;
    cout << "P2 = " << p2.getX() << ", " << p2.getY() << endl;
    
    return 0;
}

