package bilfo.demo;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@EqualsAndHashCode
@ToString
public class Triple <T1, T2, T3>{
    private final T1 first;
    private final T2 second;
    private final T3 third;

    private Triple(T1 first, T2 second, T3 third) {
        this.first = first;
        this.second = second;
        this.third = third;
    }

    public static <T1, T2, T3> Triple<T1, T2, T3> of(T1 t1, T2 t2, T3 t3) {
        return new Triple<>(t1, t2, t3);
    }
}
