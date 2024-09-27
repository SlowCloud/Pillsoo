package org.sos.pillsoo.elasticsearch.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;

@Getter
@Setter
@ToString
@Document(indexName = "pillsoo_supplement_view", createIndex = false)
public class ElasticSupplement {

    @Id
    String id;

    @Field(name = "supplementSeq")
    long supplementSeq;

    @Field(name = "click_count")
    private long clickCount;

    @Field(name = "pill_name")
    private String pillName;

    @Field(name = "expiration_date")
    private String expirationDate;

    @Field(name = "appearance")
    private String appearance;

    @Field(name = "dose_amount")
    private String doseAmount;

    @Field(name = "storage_method")
    private String storageMethod;

    @Field(name = "dose_guide")
    private String doseGuide;

    @Field(name = "functionality")
    private String functionality;

    @Field(name = "image_url")
    private String imageUrl;

    @Field(name = "preprocessed_text")
    private String preprocessedText;
}
