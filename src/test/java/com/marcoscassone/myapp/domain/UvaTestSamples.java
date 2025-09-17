package com.marcoscassone.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class UvaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Uva getUvaSample1() {
        return new Uva().id(1L).variedad("variedad1").viniedo("viniedo1").cantidad(1);
    }

    public static Uva getUvaSample2() {
        return new Uva().id(2L).variedad("variedad2").viniedo("viniedo2").cantidad(2);
    }

    public static Uva getUvaRandomSampleGenerator() {
        return new Uva()
            .id(longCount.incrementAndGet())
            .variedad(UUID.randomUUID().toString())
            .viniedo(UUID.randomUUID().toString())
            .cantidad(intCount.incrementAndGet());
    }
}
