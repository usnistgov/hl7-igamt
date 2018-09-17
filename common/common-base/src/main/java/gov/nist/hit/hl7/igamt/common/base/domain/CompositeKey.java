/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;

import javax.persistence.GeneratedValue;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 * @author ena3
 *
 */
public class CompositeKey implements Serializable {

	/**
	  * 
	  */
	private static final long serialVersionUID = -5077046386179385282L;
	@GeneratedValue
	@Id
	private String id;
	private int version;
	private static final int firstVersion = 1;

	public String getId() {
		return id;
	}

	public CompositeKey() {
		super();
		this.id = new ObjectId().toString();
		this.version = firstVersion;
	}

	public CompositeKey(String id) {
		this(id, firstVersion);
	}

	public CompositeKey(String id, int version) {
		super();
		this.id = id;
		this.version = version;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return "{id:" + this.id + ",version:" + this.version + "}";
	}

	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + version;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		CompositeKey other = (CompositeKey) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.toString().equals(other.id.toString()))
			return false;
		if (version != other.version)
			return false;
		return true;
	}

}
